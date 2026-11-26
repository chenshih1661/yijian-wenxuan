# 一鍵文宣

顧客輸入尺寸和文宣內容，程式自動排版；或上傳自己做好的設計，程式幫忙補出血。最後下載印刷廠可以直接印的 PDF（四邊出血 3 mm、300 dpi，沒有白邊）。

整個程式只有一個 `index.html`：不用安裝、不用資料庫，用瀏覽器打開就能用，手機和電腦都可以。

## 功能

- 兩種做法：
  - 自動排版：填內容、選版型
  - 上傳我的設計：上傳 JPG、PNG 或 PDF（Canva 匯出的也可以），自動補出血（邊緣鏡射延伸）、比例不合時可裁切或補底色、可一鍵照設計比例調整尺寸
- 尺寸：A5、A4、A3、A2、名片、明信片、正方形、DL 長條，或自訂（20～5000 mm，帆布、看板也可以），出血可調
- 微調（整體）：標題／價格／內文大小 50%–200%、照片區 40%–160%、邊界留白 30%–200%（最少保留 3 mm）、文字對齊、自訂品牌色
- 微調（單獨調整每個元素）：在「微調」分頁點預覽上的標題、價格、照片、QR Code 等，可以直接拖曳移動（靠近中線會自動對齊）、拉四角放大縮小（30%–300%）、旋轉（±180°）、換文字色與底色、隱藏／再顯示；支援復原上一步、方向鍵微移、Delete 隱藏、Ctrl+Z 復原；每個版型各自記住，換尺寸時位置等比例跟著調整
- 印刷安全：文字或 QR Code 被拖出藍色虛線（安全範圍）或成品範圍時會自動提醒
- 操作介面：桌機左邊設定、右邊預覽固定不動；手機預覽固定在上方、下載鍵固定在底部；設定分成尺寸／內容／版型／微調四個分頁；點預覽上的文字、照片、QR Code 會直接跳到對應欄位
- 14 種版型 × 12 組配色 × 3 種字型（黑體、明體、文楷）
  - 廣告促銷：爆炸價、量販 DM、超大數字、優惠券、斜切動感、普普網點、霓虹夜、封鎖膠帶
  - 簡約質感：大圖置頂、滿版照片、色塊大字、雜誌分欄、置中典雅、簡約卡片
- 欄位：店名、主標題、副標題、醒目標語、大字價格／折扣、行動呼籲、內容重點、活動資訊、聯絡方式、QR Code
- 文字自動縮放：內容多就縮小、內容少就放大，主標題自動平均斷行，句號逗號不會跑到行首
- 上傳主視覺照片、Logo；填網址會自動產生 QR Code
- AI 一鍵生成整張海報（選用，免費）：顧客填好內容按一下，AI 依內容畫出整張海報的畫面（主角、場景、配色，並在上方或下方留白），文字、價格、電話、QR Code 由程式一字不差排在留白處，一次 2 張不同構圖讓顧客挑；字色和襯底會依畫面明暗自動決定，選好後自動 AI 放大成 300 dpi，之後還能在「微調」移動或修改
- AI 生成主視覺（選用）：描述想要的畫面、選 8 種風格（寫實照片、美食攝影、商品棚拍、插畫、水彩、3D 卡通、日系清新、霓虹夜景），依版型照片區比例一次畫 2 張，點一下就放進文宣
- AI 放大成印刷解析度：選了 AI 圖會自動用 AI 放大到約 300 dpi（補出邊緣和紋理細節），下載 PDF 時自動用放大後的圖，也可以按「下載印刷用原圖」拿到 300 dpi 的 JPG；顧客上傳的低解析照片也有「AI 放大」按鈕
- 自動檢查：照片解析度不足、文字放不下、QR Code 太小、出血不足
- 輸出：
  - 印刷用 PDF：成品＋出血，沒有白邊；已設定 TrimBox（成品尺寸）與 BleedBox（出血範圍）；印刷廠要裁切線時再勾選
  - 成品圖 JPG：300 dpi、裁切後的樣子，可以先傳給顧客確認或放社群
- 推薦 3 種版本：有接 AI 時由 AI 挑版型和配色，也可以潤飾文案；沒接 AI 時依「想要的感覺」關鍵字推薦

## 用 LINE 分享網址

LINE 的內建瀏覽器不能下載檔案。程式已經會自動處理：在 LINE 裡打開時，會自動改用手機的 Safari 或 Chrome 開啟。
分享時也可以直接用這種網址，保證會用手機瀏覽器開：

```
https://你的帳號.github.io/flyer/?openExternalBrowser=1
```

Facebook、Instagram 的內建瀏覽器也不能下載，頁面上方會出現黃色提示，教顧客改用瀏覽器開啟。
手機上另外有「傳送 PDF」按鈕，可以直接把印刷檔傳到 LINE、Email 或存到檔案。

## 放上網路給顧客用（GitHub Pages，免費）

1. 申請 GitHub 帳號，按「New repository」建立一個公開的專案，例如取名 `flyer`
2. 按「Add file → Upload files」，上傳 `index.html`、`README.md`、`LICENSE`、`worker.js`
3. 進入專案的「Settings → Pages」，Branch 選 `main`，按 Save
4. 約一分鐘後會出現網址 `https://你的帳號.github.io/flyer/`，把這個網址給顧客就能用

## 接上 AI（選用）

AI 的金鑰不能直接寫在網頁裡，不然任何人都能拿去用。做法是架一個小小的中繼服務（Cloudflare Workers，免費方案就夠）。同一個 Worker 可以同時負責「AI 生圖」和「文字 AI」，兩個都是選用。

### 第一步：建立 Worker（兩種 AI 都要）

1. 申請 Cloudflare 帳號（免費）：https://dash.cloudflare.com/sign-up
2. 左邊選「Workers & Pages」→「Create」→「Create Worker」，名稱例如 `yijian-ai`，按 Deploy
3. 按「Edit code」，把 `worker.js` 的內容整個貼上取代，按 Deploy
4. 回到 Worker 的「Settings → Variables and Secrets」新增 `ALLOW_ORIGIN`：你的網址，例如 `https://你的帳號.github.io`（只讓你的網站呼叫）
5. 記下 Worker 的網址，例如 `https://yijian-ai.你的帳號.workers.dev`

### AI 生圖（免費額度）

顧客在「內容」分頁的主視覺照片旁按「AI 生成」，輸入想要的畫面、選風格，就會依版型照片區的比例畫 2 張圖讓顧客挑。

1. 在 Worker 的「Settings → Bindings」按「Add binding」→「Workers AI」，變數名稱填 `AI`，儲存後重新 Deploy
2. 打開 `index.html`，找到 `const CONFIG`，把生圖網址填進去（Worker 網址最後加 `/image`）：

   ```js
   const CONFIG = { aiEndpoint: '', imageEndpoint: 'https://yijian-ai.你的帳號.workers.dev/image', imageCount: 2, imageMaxSide: 1536, ... };
   ```

   （這個專案的 `index.html` 已經填好原作者的 Worker 網址；Worker 只允許原作者的網站呼叫，你自己架的話請換成你的網址。`...` 的其他設定維持預設即可。）

- 使用模型：FLUX.2 [klein] 4B（Apache 2.0 授權，產生的圖可以商用）
- 費用：Cloudflare 每天給 10,000 Neurons 免費額度（台灣時間每天早上 8 點重置）。依圖的大小，一張約用 50–160（以 512×512 為一格計算，A5 傳單常見的 1216×720 約 156），一天大約可以畫 60 張以上（每按一次產生 2 張）。**保持免費方案**的話，額度用完只會暫停到隔天，不會扣款；顧客會看到「今天的免費額度用完了」
- 解析度：依照片區大小產生約 200 dpi 的圖，最大 1536 像素（`imageMaxSide` 可改到 1920，但每張會用比較多額度）；顧客選圖後會再自動用 AI 放大到約 300 dpi（見下一節）
- 每次產生幾張：`imageCount`（1～4）
- 有接文字 AI 的話，會先請 Claude 把顧客的中文描述改寫成更精準的英文提示詞，效果會更好；沒接也能用中文直接畫

### AI 一鍵生成整張海報

和「AI 生圖」用同一個 Worker，不用另外設定。流程：

1. 顧客填的中文文案先送到 Worker 的 `/scene`，由 Cloudflare 的免費文字模型改寫成英文的「畫面描述」（只寫看得到的東西，不寫招牌、價格、文字）。模型依序試 Qwen3、Llama 3.1、Llama 3.2，被 Cloudflare 下架時會自動換下一個（也可以用 `TEXT_MODEL` 指定）
2. 網頁再把描述裡提到招牌、文字、引號的句子拿掉，避免 AI 在畫面裡寫字
3. 用 FLUX.2 [klein] 依成品＋出血的比例畫 2 張：直式一張留白在上、一張留白在下（橫式是左、右）
4. 程式量留白處的亮度，淺色畫面用深色字、深色畫面用白色字，畫面太雜時自動加漸層襯底；文字全部由程式排，不會錯字
5. 顧客點一張就套用「AI 海報」版型，並自動 AI 放大到 300 dpi

畫面大小由 `posterMaxSide`（預設 1280 像素）控制，A5 一張約用 156 Neurons。

### AI 放大（免費，不用設定）

選了 AI 圖之後，網站會自動把圖放大到印刷需要的約 300 dpi；顧客上傳的照片解析度不夠時，照片旁會出現「AI 放大」按鈕。

- 模型：Real-ESRGAN（realesr-general-x4v3，BSD 3-Clause 授權），放在 `models/realesr-general-x4v3.onnx`，**上傳到 GitHub 時要連 `models` 資料夾一起上傳**
- 計算在顧客自己的電腦或手機上進行（用 ONNX Runtime Web，從 jsDelivr 載入），不需要伺服器、不花錢、不佔 Cloudflare 額度
- 支援 WebGPU 的瀏覽器（新版 Chrome、Edge、Safari）用顯示卡算，幾秒到十幾秒；不支援的會用 CPU 算，預估超過 60 秒（`upscaleMaxWait`）就自動改用一般放大，不會卡住
- 第一次使用要下載約 3–7 MB 的程式與 2.4 MB 的模型，之後瀏覽器會快取
- 下載 PDF 時如果還在放大，會等放大完成再產生
- 放大是用 AI 補細節，A4、A3 效果很好；更大的海報近看會有 AI 修飾感

### 文字 AI（推薦版型、潤飾文案，依用量付費）

1. 到 https://console.anthropic.com 申請 API 金鑰（依使用量付費）
2. 在 Worker 的「Settings → Variables and Secrets」新增 `ANTHROPIC_API_KEY`：你的金鑰（選「Secret」類型）
3. 在 `index.html` 的 `CONFIG` 把 `aiEndpoint` 填成 Worker 網址（最後不用加 `/image`）
4. 建議在 Cloudflare 加上流量限制（Rate limiting），避免被人大量呼叫產生費用

沒有接 AI 也能完整使用：「AI 生成」按鈕不會出現，「推薦 3 種版本」改用關鍵字判斷。

## 給印刷廠的檔案規格

- PDF 1.4，一頁
- MediaBox＝BleedBox：成品＋出血（勾選裁切線時，四邊各多 9 mm 放裁切線）；TrimBox：成品尺寸
- 最大 5000 × 5000 mm（PDF 格式上限約 5080 mm）
- 影像 300 dpi（像素總數超過 1.2 億時自動調低：A0 約 277 dpi、5×1 公尺約 124 dpi；低於 100 dpi 會提醒）
- 色彩 RGB（sRGB），由印刷廠轉 CMYK；特別鮮豔的藍、綠、螢光色印出來會略暗
- 文字已和圖片一起轉成高解析影像，印刷廠不需要安裝字型

## 程式結構（想自己改的話）

都在 `index.html` 最後的 `<script>` 裡，註解是中文：

| 名稱 | 用途 |
|---|---|
| `TEMPLATES` | 版型。每個版型是一個 `draw(L, c)` 函式，以 mm 為單位排版；要新增版型就加一項 |
| `PALETTES` | 配色：底色、文字、主色、強調色、淡色 |
| `FONTS` | 字型（Google Fonts） |
| `stack()` | 排版核心：把標題、副標、內容按比例一起縮放到剛好放得下 |
| `paint()` | 把排版畫出來；預覽、縮圖、PDF 共用同一套 |
| `buildPDF()` | 自寫的 PDF 產生器；分段畫 300 dpi 影像，手機也不會記憶體不足 |
| `aiPrompt()` | 給 AI 的指示 |

## 之後可以加的功能

- CMYK 轉檔（需要在伺服器上用 Ghostscript）
- 正反面兩頁
- 文字保留向量（把字型嵌入 PDF）
- 顧客按下載後，同時把檔案寄到你的信箱
- 更多版型
- 加入自己的文字方塊、貼圖

## 授權

本程式以 MIT License 釋出，見 `LICENSE`。

使用到的開源資源：

- 字型：Noto Sans TC、Noto Serif TC、霞鶩文楷 TC（LXGW WenKai TC），皆為 SIL Open Font License，可商用、可嵌入印刷品
- AI 放大模型：Real-ESRGAN（realesr-general-x4v3），Copyright (c) 2021 Xintao Wang，BSD 3-Clause License（見 `models/LICENSE-Real-ESRGAN.txt`），轉成 ONNX 格式、權重存成半精度
- AI 放大執行環境：ONNX Runtime Web，Copyright (c) Microsoft Corporation，MIT License（執行時從 jsDelivr 載入）
- AI 生圖模型：FLUX.2 [klein] 4B，Black Forest Labs，Apache 2.0 License（在 Cloudflare Workers AI 上執行）
- QR Code 程式庫：qrcode-generator，Copyright (c) 2009 Kazuhiko Arase，MIT License
- 「QR Code」是 DENSO WAVE INCORPORATED 的註冊商標
