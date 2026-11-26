// 一鍵文宣的 AI 中繼服務（Cloudflare Worker）
// 作用：
//   1. 文字 AI（推薦版型、潤飾文案）：網頁把需求送到這裡，這裡帶著你的金鑰去問 Claude。
//   2. AI 生圖（網址最後加 /image）：用 Cloudflare 內建的 Workers AI 畫圖，不需要另外的金鑰。
//   3. 畫面描述（網址最後加 /scene）：用 Workers AI 的文字模型，把顧客的中文文案改寫成英文畫面描述，
//      讓生圖不會在畫面裡亂寫字。
// 金鑰放在 Cloudflare 的設定裡，不會出現在網頁上。
//
// 需要設定的項目（Worker 的 Settings）：
//   Bindings → Add → Workers AI，變數名稱填 AI          （AI 生圖要用）
//   Variables and Secrets：
//     ANTHROPIC_API_KEY  你的 Claude API 金鑰（Secret，文字 AI 要用；只用生圖可以不填）
//     ALLOW_ORIGIN       允許呼叫的網址，例如 https://你的帳號.github.io
//     MODEL              （選填）文字 AI 的模型，預設 claude-haiku-5-5
//     IMAGE_MODEL        （選填）生圖模型，預設 @cf/black-forest-labs/flux-2-klein-4b（Apache 2.0，可商用）
//     TEXT_MODEL         （選填）畫面描述用的文字模型，預設依序試 Qwen3、Llama 3.1、Llama 3.2
//
// 費用：Workers AI 每天有免費額度（10,000 Neurons，每天早上 8 點重置），
// 一張 1536×1024 的圖大約用 156，一天約 60 張。免費方案用完只會暫停到隔天，不會扣款。

const lastHit = new Map(); // 同一個 IP 太頻繁時先擋一下（每台伺服器各自記，只是簡單防濫用）

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOW_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type'
    };
    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), { status, headers: { ...cors, 'content-type': 'application/json; charset=utf-8' } });

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') return json({ error: 'bad_request' }, 400);
    const path = new URL(request.url).pathname.replace(/\/+$/, '');

    if (path.endsWith('/image')) return image(body, request, env, json);
    if (path.endsWith('/scene')) return scene(body, env, json);
    return text(body, env, json);
  }
};

async function text(body, env, json) {
  const prompt = body.prompt;
  if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 20000) return json({ error: 'bad_request' }, 400);
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'not_configured' }, 501);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: env.MODEL || 'claude-haiku-5-5',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (res.status === 429) return json({ error: 'rate_limited' }, 429);
  if (!res.ok) return json({ error: 'upstream_error' }, 502);

  const data = await res.json();
  const out = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  return json({ text: out });
}

async function image(body, request, env, json) {
  if (!env.AI) return json({ error: 'not_configured' }, 501);
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 1800) : '';
  if (!prompt) return json({ error: 'bad_request' }, 400);

  const ip = request.headers.get('cf-connecting-ip') || 'x', now = Date.now();
  if (now - (lastHit.get(ip) || 0) < 1500) return json({ error: 'too_fast' }, 429);
  lastHit.set(ip, now);
  if (lastHit.size > 5000) lastHit.clear();

  const size = v => Math.min(1920, Math.max(256, Math.round((Number(v) || 1024) / 16) * 16));
  const form = new FormData();
  form.append('prompt', prompt);
  form.append('width', String(size(body.width)));
  form.append('height', String(size(body.height)));
  if (Number.isInteger(body.seed) && body.seed >= 0) form.append('seed', String(body.seed));
  const packed = new Response(form);

  try {
    const out = await env.AI.run(env.IMAGE_MODEL || '@cf/black-forest-labs/flux-2-klein-4b', {
      multipart: { body: packed.body, contentType: packed.headers.get('content-type') }
    });
    if (!out || !out.image) return json({ error: 'upstream_error' }, 502);
    return json({ image: out.image });
  } catch (e) {
    const msg = String((e && e.message) || e);
    const detail = msg.slice(0, 300);
    if (/neurons|allocation|quota|4006|daily free/i.test(msg)) return json({ error: 'quota', detail }, 429);
    if (/nsfw|unsafe|flagged|moderation|safety filter/i.test(msg)) return json({ error: 'blocked', detail }, 422);
    return json({ error: 'upstream_error', detail }, 502);
  }
}

const SCENE_RULES = 'You turn Chinese advertising copy into a short English description of ONE scene for an image generator. ' +
  'Describe only visible things: the main subjects, setting, lighting and colors, in 20 to 45 English words. ' +
  'Never mention shop openings, prices, discounts, words, letters, signs, menus, labels, logos, posters or any written text. ' +
  'Show the products or services named in the copy as the main subjects and do not add unrelated foods, objects or people. ' +
  'Reply with the description only.';

// 依序嘗試的文字模型（模型被 Cloudflare 下架時會自動換下一個）
const SCENE_MODELS = ['@cf/qwen/qwen3-30b-a3b-fp8', '@cf/meta/llama-3.1-8b-instruct-fp8', '@cf/meta/llama-3.2-3b-instruct'];

async function scene(body, env, json) {
  if (!env.AI) return json({ error: 'not_configured' }, 501);
  const text = typeof body.text === 'string' ? body.text.trim().slice(0, 1200) : '';
  if (!text) return json({ error: 'bad_request' }, 400);
  let last = '';
  for (const model of [env.TEXT_MODEL, ...SCENE_MODELS].filter(Boolean)) {
    try {
      const user = model.includes('qwen3') ? text + '\n/no_think' : text;
      const out = await env.AI.run(model, { messages: [{ role: 'system', content: SCENE_RULES }, { role: 'user', content: user }], max_tokens: 400 });
      const raw = out && (out.response ?? (out.choices && out.choices[0] && out.choices[0].message && out.choices[0].message.content) ?? (out.result && out.result.response));
      const s = String(raw || '').replace(/<think>[\s\S]*?<\/think>/g, '').replace(/\s+/g, ' ').trim().replace(/^["'“”]+|["'“”]+$/g, '');
      if (s) return json({ scene: s.slice(0, 400) });
    } catch (e) {
      last = String((e && e.message) || e);
      if (/neurons|allocation|quota|4006|daily free/i.test(last)) return json({ error: 'quota', detail: last.slice(0, 300) }, 429);
    }
  }
  return json({ error: 'upstream_error', detail: last.slice(0, 300) }, 502);
}
