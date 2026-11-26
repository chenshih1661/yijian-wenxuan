// 一鍵文宣的 AI 中繼服務（Cloudflare Worker）
// 作用：網頁把排版需求送到這裡，這裡帶著你的金鑰去問 Claude，再把答案回傳。
// 金鑰放在 Cloudflare 的 Secret 裡，不會出現在網頁上。
//
// 需要設定的變數（Settings → Variables and Secrets）：
//   ANTHROPIC_API_KEY  你的 Claude API 金鑰（Secret）
//   ALLOW_ORIGIN       允許呼叫的網址，例如 https://你的帳號.github.io
//   MODEL              （選填）要用的模型，預設 claude-haiku-5-5

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
    const prompt = body && body.prompt;
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 20000) return json({ error: 'bad_request' }, 400);

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
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    return json({ text });
  }
};
