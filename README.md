# TVBS AI Knowledge Base

> TVBS AI 未來科技部的 AI 知識電子報網站
> 線上版：https://ainews.tvbs.ai/

---

## 📋 專案概覽

這個專案有 **兩個並存** 的部分：

| 部分 | 角色 | 路徑 |
|------|------|------|
| **Dashboard（新版主站）** | 整合首頁、搜尋、各分頁；資料來自 JSON | 專案根目錄 |
| **歷期電子報（archive）** | 第 001 期至今的靜態 HTML | `tvbs-ai-newsletter/issues/` |

新人 90% 的工作會集中在 **Dashboard** 那一層，舊版的 per-issue HTML 主要是當作歷史內容供搜尋與閱讀。

---

## 🛠 技術棧

完全 **無建置工具、無框架、無 npm dependency**。

- HTML + CSS + Vanilla JS（ES2017+）
- 字體：Google Fonts（Noto Sans TC, Inter）
- 資料：純 JSON 檔案
- 本地預覽：需要 **Live Server**（不能直接 `file://` 開啟，因為要 fetch JSON）

---

## 🗂 專案結構

```
AI NEWS LETTER/
├── index.html                       # ★ 主入口（新版 Dashboard）
├── dashboard.css                    # 主樣式表（~5500 行）
├── dashboard.js                     # 主程式邏輯
│
├── data/                            # 新版 Dashboard 的資料源
│   ├── articles.json                #   重點趨勢的文章
│   ├── weekly-summaries.json        #   10 秒看趨勢
│   ├── tool-intro.json              #   AI 工具介紹
│   ├── tools.json                   #   AI 工具資源目錄
│   └── prompt-sites.json            #   PROMPT 資源網站
│
├── tvbs-ai-newsletter/              # 舊版 / 歷期靜態網站
│   ├── issues/                      #   第 001 ~ 第 018 期 HTML
│   ├── search-index.json            #   舊期內容的搜尋索引
│   ├── issues-metadata.json         #   每期 metadata（標題、日期、封面）
│   └── README.md                    #   舊版的舊 README（已過時）
│
├── TVBS_logo.png / TVBS_logo_white.png
├── search-index.json                # 已棄用（保留供相容）
└── README.md                        # 本檔案
```

---

## 🚀 本地開發

### 必須使用 Live Server（不能直接點開 HTML）

因為 `dashboard.js` 用 `fetch` 載入 JSON 檔案，瀏覽器以 `file://` 協定打開時會被 CORS 阻擋。

**推薦做法**：

1. VS Code 安裝擴充套件 **Live Server**（作者 Ritwick Dey）
2. 在 `index.html` 上右鍵 → `Open with Live Server`
3. 瀏覽器自動開啟 http://127.0.0.1:5500/

或用 Python：

```bash
python -m http.server 8000
# 然後開 http://localhost:8000/
```

---

## 📄 分頁與資料對應

| 分頁 | HTML 區段 ID | 資料來源 | JS 渲染函式 |
|------|------------|---------|------------|
| 首頁 | `#page-home` | `articles.json` + `weekly-summaries.json` | `renderSummaryItem()` |
| 重點趨勢 | `#page-news` | `articles.json` | trendGrid loop |
| 10 秒看趨勢 | `#page-summaries` | `weekly-summaries.json` | `renderSummaryItem()` |
| Prompt 技巧分享 | `#page-prompt-tips` | `prompt-tips.json` | `renderPrompts()` |
| Prompt 資源庫 | `#page-prompt-sites` | `prompt-sites.json` | `renderPromptSites()` |
| AI 工具介紹 | `#page-tool-intro` | `tool-intro.json` | toolIntroContainer |
| AI 工具資源 | `#page-tools` | `tools.json` | toolsContainer |
| 歷期電子報 | `#page-archive` | `issues-metadata.json` | `renderArchive()` |
| 文章 Modal | `#articleModal` | 上述任一筆資料 | `showArticle()` |
| **Outlook 產生器**（隱藏）| `#page-outlook-gen` | 上述 articles + summaries | `initOutlookGenerator()` |

---

## 📧 Outlook 版本產生器（隱藏頁）

**入口**：`https://ainews.tvbs.ai/#outlook-gen`
（不放在 nav，只能直接打 URL 進）

### 用途
每期發報前用這個頁面把當前 `articles.json` + `weekly-summaries.json` 內容**自動轉成 Outlook 用的 HTML**，省下手動填入 email 模板的時間。

### 控制項（單一輸入：篩選日期）

- **篩選日期**：唯一需要使用者操作的欄位。原生 `<input type="date">`，選了之後下方期號 + 4 個分類篇數一起出現
- **期號（自動）**：從「篩選後內容裡最新一筆文章日期」推算「YYYY 年 M 月號」，純顯示不可編輯
- **4 個篇數顯示**：inline 格式「重點趨勢：3 篇」，唯讀，數字即時等於「篩選日期（含）以後實際筆數」
- **產出按鈕**：篩選日期空著時 disabled，選了之後才亮起來
- **產出狀態 status**：按了「產出」之後才出現綠色完成訊息

### 渲染邏輯

按了篩選日期就會抓「該日（含）以後」的所有內容（重點趨勢 + Prompt + AI 工具介紹 + 10 秒看趨勢）餵進 Outlook 模板，**沒有篇數上限**、篩出來幾筆就放幾筆。原本的「篇數模式」已移除 — 流程簡化成「日期決定一切」。

### 工作流程

1. 選篩選日期（選上次電子報寄出後一天）
2. 按「產出」 → 預覽出現
3. 檢查預覽結果是否有誤
4. 按「複製 HTML」 → 貼進 Outlook 寄送系統

### 設計來源
參考舊版手動模板 `tvbs-ai-newsletter/outlook version/018foroutlook.html`，視覺風格對齊新 dashboard 的 light theme（白底 + 紫色品牌色 + tag 色票編碼）。

### 相關程式碼
- HTML 區段：`ai-newsletter-dashboard.html` 內的 `<div id="page-outlook-gen">`
- 樣式：`dashboard.css` 內 `/* Outlook 版本產生器 */` 區段（class 前綴 `.og-*`）
- 邏輯：`dashboard.js` 內 `initOutlookGenerator()`、`ogBuildEmailHTML()`、`ogGenerate()` 等

---

## 🏷 標籤系統

站內 4 種內容類型用不同結構的 tag，詳細規範與命名歷史見專案根目錄的 [CLAUDE.md](CLAUDE.md)（Claude Code 對話會自動載入）。重點摘要：

### 重點趨勢 + 10 秒看趨勢（雙層 tag）

每筆條目都有兩個欄位：

```json
{
  "tag": "新工具",
  "tags": ["程式設計", "工作流整合"]
}
```

**第一層：內容屬性 `tag`（6 選 1）**

| Tag | 適用 | 色票（CSS var） |
|-----|------|-----------------|
| 模型發布 | 新 LLM / 基礎模型 | `--tag-model` 藍 |
| 新工具 | 全新工具/服務「首次」上線 | `--tag-tool` 橙 |
| 新功能 | 既有產品的新版本 | `--tag-feature` 綠 |
| 應用技巧 | 教學 / 案例 | `--tag-tip` 紫紅 |
| 產業動態 | 公司新聞、市場 | `--tag-industry` 灰 |
| 法律規範 | 政策、訴訟、合規 | `--tag-legal` 紅 |

**第二層：適用情境 `tags`（13 選 1-4 個）**

```
圖像生成、影片製作、聲音處理、寫作協助、即時翻譯、
自動化、工作流整合、整理資料、簡報設計、資料研究、
程式設計、訪談記錄、觀念學習
```

特殊規則：
- 「觀念學習」專給「不能直接用、但讀者該知道」的資訊型文章
- 「法律規範」只當第一層 `tag`，不放進 `tags`
- **tags 嚴格對應原文明寫的應用場景，不要從產品類型推斷**（例：即時語音模型 ≠ 即時翻譯 + 訪談記錄；只在原文有提才放）

### Prompt 技巧分享（單層 tag，4 選 1）

`prompt-tips.json` 用單層分類：基礎入門 / 情境應用 / 進階優化 / 生圖指令。

### AI 工具介紹（單層 tag，12 選 1）

`tool-intro.json` 也是單層 `tag`（2026-05 從 `cat` rename 為 `tag` 統一欄位命名）：應用技巧 / 代理操作 / 影片生成 / 筆記知識 / 設計創作 / 簡報設計 / 對話助理 / 搜尋研究 / 影音處理 / 工具教學 / 多模態 / 寫程式。

---

## 🔗 文章 Modal 的延伸閱讀

每篇文章 modal 底部會自動顯示「延伸閱讀」3 張卡片，依文章類型用不同的池子規則：

| 開啟的文章 | 延伸閱讀池規則 |
|---|---|
| 重點趨勢（原生 + legacy） | 重點趨勢 + Prompt + AI 工具介紹 全 3 類混合，純粹依日期 desc 排 |
| Prompt 技巧分享 | **Prompt 優先**：先放未看過的 Prompt（依日期），用完才從 工具介紹 + 重點趨勢 依日期遞補 |
| AI 工具介紹 | **工具優先**：先放未看過的 工具（依日期），用完才從 Prompt + 重點趨勢 依日期遞補 |
| 10 秒看趨勢 | 只從 10 秒看趨勢 池抓（橫排單欄列表，無縮圖） |

**去重機制**：本次瀏覽看過的文章（`window.__viewedTitles` Set）不再出現在後續延伸閱讀，瀏覽器刷新後重置。

**實作位置**：`dashboard.js` 內 `showArticle()` 函式的延伸閱讀段（搜「延伸閱讀」即可定位）。

---

## ➕ 新增內容指南

> ⚠️ **CMS 後台目前尚未設計完成 — 屬於「先建好骨架備用」狀態**
> `admin/` 資料夾的 Sveltia CMS 整合（config.yml + 入口 HTML）已就位，本機可用 `npx decap-server` + `npx serve .` 跑起來，但**正式上線的工作流程、權限分配、PAT 管理規範等都還沒拍板定案**，現階段**所有新增/編輯內容仍走「直接編輯 JSON 檔 + git push」**。
> CMS 完工前請以下面 JSON 編輯說明為準；CMS 細節可參考 [`admin/README.md`](admin/README.md) 但僅供參考，不代表已是正式流程。

### 新增「重點趨勢」文章

編輯 `data/articles.json`(`{ items: [...] }` 結構,items 內為文章陣列)：

```json
{
  "id": "some-id",
  "title": "文章標題",
  "date": "2026-05-12",
  "image": "https://...",
  "tag": "新工具",
  "tags": ["程式設計", "自動化"],
  "summary": "一句話摘要，列表會顯示這段。",
  "content": "<p class=\"first-paragraph\">完整 HTML 內文...</p>",
  "sourceUrl": "https://外部來源連結",
  "sourceLabel": "官方介紹 →",
  "featured": false
}
```

- `featured: true` 會讓它出現在首頁 hero 區的 4 張 slide 候選池
- `content` 是完整 HTML，會在 modal 內呈現
- `image`：用自有圖床的 jsDelivr 網址（見下方「圖片素材」段落），不要用免費圖床
- **`id` 命名規則**：純語意 slug、全小寫、連字號分隔（如 `gpt-image-2`），**不加期數前綴**。articles / weekly-summaries / tool-intro 三種來源共用同一套 slug 命名空間，全站唯一即可
- **Outlook deep-link URL prefix**（每個資料源獨立 prefix，方便辨識來源）：
  - `articles.json` → `https://ainews.tvbs.ai/#article-{id}`
  - `weekly-summaries.json` → `https://ainews.tvbs.ai/#summary-{id}`
  - `tool-intro.json` → `https://ainews.tvbs.ai/#tool-{id}`
  - `prompt-tips.json` → `https://ainews.tvbs.ai/#prompt-{id}`（保留位、目前 Outlook 走舊期 HTML deep link）
  - 四個 prefix 都會被 `getArticleHash()` 識別並開啟對應 modal；舊 email 用 `#article-{id}` 仍可正常運作（向後相容）

### 新增「10 秒看趨勢」條目

編輯 `data/weekly-summaries.json`：

```json
{
  "id": "some-unique-id",
  "title": "標題",
  "date": "2026-05-10",
  "tag": "模型發布",
  "tags": ["程式設計"],
  "summary": "簡短描述。支援 <strong>HTML 標籤</strong>(粗體會在文章 modal 內顯示、卡片預覽會自動 normalize)。也可內嵌 <img> 加圖,例如 <img src=\"...\" style=\"max-width:100%;border-radius:8px\">",
  "sourceUrl": "https://..."
}
```

### 新增「Prompt 技巧分享」文章

編輯 `data/prompt-tips.json`：

```json
{
  "id": "prompt-xxx",
  "title": "標題",
  "date": "2026-05-10",
  "tag": "基礎入門",
  "summary": "一句話摘要",
  "image": "https://...",
  "imageCaption": "圖片說明（選填）",
  "content": "<div class=\"prompt-cover\">...</div><p>內文...</p>",
  "sourceUrl": "https://...",
  "sourceLabel": "官方介紹 →"
}
```

內文可用的特殊樣式 class（[dashboard.css](dashboard.css) 有定義）：
`.prompt-cover` 封面圖 / `.prompt-quote` Prompt 範例引用 / `.callout-warn` 黃色提醒 / `.callout-tip` 灰色小提示 / `.prep-box` 使用前準備 / `.scenario-card` 編號情境卡片 / `.step-card` 步驟卡片 / `.article-list-box` 條列灰底框。

### 新增「AI 工具介紹」條目

編輯 `data/tool-intro.json`：欄位 `tag` 為單層分類（2026-05 從 `cat` rename）、`openInModal: true` 才會點擊開內文 modal、`featured: true` 進首頁 hero 候選。

### 新增新一期電子報（歷史 archive）

1. 在 `tvbs-ai-newsletter/issues/` 複製最新一期改名（例：`019.html`）
2. 編輯內容
3. 在 `tvbs-ai-newsletter/issues-metadata.json` 加入新期 metadata
4. 用 `tvbs-ai-newsletter/update_search_index.js` 更新搜尋索引
5. 重新整理 dashboard 確認封面卡片有顯示

---

## 🎨 設計系統

### 色彩主題

主要 CSS 變數（定義在 `dashboard.css` 開頭的 `:root`）：

```css
--primary: #5b5bd6;          /* 主紫色（TVBS 設計色票）*/
--primary-dark: #4848b8;
--accent-2: #8b8be0;         /* 淡紫 */
--text: #0a2540;             /* 深色文字 */
--text-light: #6b7280;       /* 灰色文字（副標、meta）*/
--border: rgba(15, 23, 42, 0.12);
--card-bg: #ffffff;
--bg: #fafbfc;
```

TVBS Logo 用 CSS filter 著色：

```css
.tvbs-logo {
  filter: brightness(0) saturate(100%) invert(20%) sepia(91%) saturate(2375%) hue-rotate(213deg) brightness(91%) contrast(99%);
}
```

來源是 `TVBS_logo_white.png`（白色版），透過 filter 著成品牌藍 `#11449f`。

### 字級階層

| 用途 | size | weight |
|------|------|--------|
| 首頁主標 | 48px | 800 |
| Section h2 | 26px | 800 |
| Article modal h3 (am-title) | 28px | 900 |
| List item title (sli-title) | 17px | 700 |
| Body text | 14-16px | 400-500 |
| Meta / labels | 11-13px | 600-700 |

### Document Reader 版型（首頁）

首頁採 Substack / Medium / Notion 風的 **單欄置中閱讀版型**：

- 最大寬度 760px、置中
- 區塊垂直堆疊：Masthead → Hero → 10 秒看趨勢 → 內部工具 → 黑客松
- 每個區塊間用細短分隔線 `<hr class="reader-divider">` 區分
- 樣式集中在 dashboard.css 的 `/* Document Reader Mode */` 區段
- **2026-05 移除 Overview band**（原本顯示「31 則精選 + 涵蓋類型/熱門情境 tag 列」），原因：stat 資訊對讀者沒實際價值、又佔據首頁黃金位置擋住真正內容。masthead 後直接接 hero 大圖，magazine-style 節奏

### Responsive 篩選 UI（桌機 chip / 手機 dropdown）

重點趨勢、10 秒看趨勢、Prompt 技巧分享三個分頁的分類篩選同套機制、桌機/手機兩種視覺：

- **桌機**：橫排 chip 列（保留原本 UX）
- **手機**：標題右側「分類篩選 ▾」按鈕，點開浮層 dropdown
  - 雙層 filter（趨勢/10 秒看趨勢）：兩列 chip-style 選項（內容屬性 + 適用情境），點 chip 直接套用、active = 紫底白字。原本是 native `<select>`，2026-05 換成 chip 是為了統一桌機/手機視覺＋觸控更友善
  - 單層 filter（Prompt）：直列選項按鈕，點選即套用 + 自動收合
  - **panel 直接掛在 `document.body`** 下（不是 h2 wrapper 裡）— 用 `position: fixed` + JS `getBoundingClientRect()` 動態算座標。原因：`.page` 帶 `animation: fadeIn` 的 transform keyframe 會讓行動瀏覽器保留 layer 提升，導致 fixed 子元素被「困住」、變透明或 hit-testing 失效，必須脫離整條 ancestor chain 才穩定
  - 按鈕本身仍在 `.filter-toggle-wrap` 包進 h2，跟標題對齊；panel 用 `.filter-panel--floating` class 識別並走 mobile 樣式
  - 有選分類時 page-header 底線下方出現「目前篩選分類：xxx」提示色塊（含一鍵清除 ✕），只在手機版顯示
  - **panel 開啟瞬間凍結在當下位置**（不會跟著頁面滾動），且**自動鎖背景 body 滾動**（用 `position: fixed + top: -scrollY` 的 iOS-safe 做法，關閉時還原 scrollY）。內容超過 viewport 高度時 panel 內部捲動，`max-height` 由 JS 即時算
- **實作位置**：`dashboard.js` 的 `initDualFilter()` / `initSingleFilter()` / `lockBodyScroll()` / `unlockBodyScroll()`、`dashboard.css` 的 `.filter-panel--floating` / `.filter-active-hint` 相關規則

---

## 📊 數據分析（GA4）

**Property**: `484079366`（TVBS AI Knowledge Base）
**Measurement ID**: `G-JQ8X854JPL`
**裝設方式**: 直接 gtag.js（非 GTM）

### 追蹤的事件

| 事件 | 觸發時機 | 主要參數 |
|------|---------|---------|
| `page_view` | 初次載入 + SPA 切分頁 | page_path, page_title, page_location |
| `article_view` | 點開文章 modal | article_title, article_tag, article_source |
| `search` | 搜尋停 1.5s（字數 ≥ 2）| search_term, result_count |
| `outbound_click` | 點外部域名連結 | link_url, link_domain, link_text |

### 重要設定

- `send_page_view: false`：關掉 GA4 自動 pageview，全部由 `switchTab()` 手動送
- 搜尋兩段式 debounce：150ms render（UX）+ 1500ms 才送 GA（避免每按一鍵都送）
- 內部連結不送 outbound（用 `URL.hostname === location.hostname` 過濾）

### 看資料的地方

| 報表 | 用途 |
|------|------|
| **Realtime** (即時) | 驗證事件有送、看當下流量 |
| **Engagement → Pages and screens** | 哪些分頁/文章最多人看 |
| **Engagement → Events → search** | 看 `search_term` 參數 — 使用者實際搜了什麼 |
| **Engagement → Events → article_view** | 哪些文章被點開最多次 |

### 舊版 (`tvbs-ai-newsletter/issues/*.html`) 還用 GTM

舊期靜態 HTML 仍透過 GTM-5FPJBLQJ 進**同一個** property（484079366），
所以新舊版的資料統一在 GA4 一個地方看。不用動舊版。

---

## 🔍 搜尋功能

搜尋邏輯在 `dashboard.js` 的 `doSearch()`：

- 搜尋 title + content 欄位
- 排序：**有日期者依日期 desc**，沒日期者（舊期）依**期號 desc**
- 結果顯示來源標籤（`getSearchSourceLabel()`），對應到分頁類別

搜尋會打到 **同一個** `searchIndex` array，這個 array 在初始載入時集合了：

1. `tvbs-ai-newsletter/search-index.json`（舊期內容）
2. 然後 push 進新 articles / summaries / tool-intros

所以搜尋會涵蓋全站內容。

---

## 🖼 圖片素材（自有圖床）

文章與工具的圖片素材統一放在獨立的圖床 repo，透過 jsDelivr CDN 出圖：

- **圖床 repo**：`github.com/YN-WU/ainews-images`（public）
- **圖片路徑**：repo 的 `images/` 資料夾
- **使用網址**：`https://cdn.jsdelivr.net/gh/YN-WU/ainews-images@main/images/{檔名}`

### 新增圖片流程
1. 把圖片上傳到 `ainews-images` repo 的 `images/` 資料夾
2. 在 `articles.json` / `tool-intro.json` 等的 `image` 欄位填上述 jsDelivr 網址

### 注意事項
- **不要用免費圖床**（i.meee 等）—— 會被砍圖。2026-05 已把全站約 400 條舊連結從 i.meee 等外部圖床搬到自有圖床
- **jsDelivr 會強快取**：同路徑的圖被覆蓋後 CDN 要數小時～數天才更新 → 永遠用新檔名，不要覆蓋舊圖
- 檔名避免空格與中文（URL 要編碼，易出錯）

> 搬遷用的一次性腳本（`migrate-images.js`、`replace-image-urls.js`）與本機暫存的 `images/` 資料夾已列入 `.gitignore`，不進主專案 repo。

---

## ⚠️ 常見地雷

### 1. 直接點開 HTML 看不到內容

→ 一定要用 Live Server，因為 fetch JSON 需要 HTTP 協定。

### 2. JSON 格式錯誤導致整個 dashboard 空白

→ 修改 JSON 後務必驗證（VS Code 會提示）。
→ 多餘的逗號、中英文括號混用都會壞。

### 3. 內文 HTML 寫死的暗色色票

→ 之前是暗主題，內文 JSON 裡有些 `style="background:rgba(20,35,75,0.4)"` 是舊色票。
→ 新內容請用 `rgba(91,91,214,0.06)` 淡紫底 + `border-left:3px solid var(--primary)` 樣式。

### 4. tag 命名不要用 AI 前綴

→ 早期版本曾用「AI 工具」「AI 代理」，2026-05 已 rename 為「新工具」。「自主代理」tag 已於 2026-05 移除（agent 屬性歸入新工具/新功能）。
→ 寫新內容請使用新名稱。

### 5. `<title>` 跟 nav `brand-sub` 要同步

→ 修改網站標語時，主 HTML 的 `<title>` 跟 nav 的 `.brand-sub` 都要改。
→ Archived `tvbs-ai-newsletter/ai-newsletter-dashboard-blue.html`（舊版藍色主題）也建議同步。

### 6. tool-intro.json 欄位 `cat` 已 rename 為 `tag`（2026-05）

→ 舊文檔/腳本若還寫 `t.cat` 要改成 `t.tag`。CMS schema、dashboard.js 引用、JSON 資料都已同步。

### 7. Prompt 技巧分享資料已從 inline JS 搬到 `data/prompt-tips.json`（2026-05）

→ `dashboard.js` 內舊版的 `promptData` 陣列已移除。新增/編輯走 JSON 檔（或 CMS）。

### 8. 首頁「10 秒看趨勢」顯示篇數開關

→ `dashboard.js` 頂部有常數 `HOME_WEEKLY_SUMMARIES_LIMIT`。`null` = 不限制（目前狀態）、改成數字（如 `8`）就會只顯示最新 N 篇。發完電子報想清空首頁時可以暫時改成小數字。

### 9. CLAUDE.md 是 tag 體系的 source of truth

→ 任何 tag 規則調整要先更 [CLAUDE.md](CLAUDE.md)（會被 Claude Code 對話自動載入），README 跟 admin/config.yml 跟著對齊。

### 10. 分頁名稱「30 秒看趨勢」已 rename 為「10 秒看趨勢」（2026-05）

→ 全站 8 個檔（HTML/CSS/JS/CMS/README/CLAUDE/Outlook 模板）所有 UI 字串、註解、文件已同步。
→ 資料檔仍叫 `weekly-summaries.json`（JSON 檔名沒改，內部 page id 仍為 `summaries`）。
→ 跟「30 秒原創音樂」「30 秒影片」等「真實時間單位」的文案無關，那些保留原樣。

---

## 🌐 部署

線上版位於 https://ainews.tvbs.ai/

部署方式：直接把整個 repo push 上去（靜態檔案 hosting），任何 static hosting 都能用（GitHub Pages、Cloudflare Pages 等）。

確認 `data/*.json` 路徑能正確被 dashboard.js fetch 到即可。

---

## 📞 聯絡

- 部門：TVBS AI 未來科技部
- 對外網域：https://ainews.tvbs.ai/
- 公司：聯利媒體股份有限公司

---

## 📜 授權

Copyright © 2025-2026 TVBS AI 未來科技部 | 聯利媒體股份有限公司

本電子報為公司內部刊物，僅供公司內部學習參考，相關資訊版權歸原作者所有。
