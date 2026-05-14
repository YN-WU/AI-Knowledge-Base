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
├── ai-newsletter-dashboard.html     # ★ 主入口（新版 Dashboard）
├── dashboard.css                    # 主樣式表（~4000 行）
├── dashboard.js                     # 主程式邏輯
│
├── data/                            # 新版 Dashboard 的資料源
│   ├── articles.json                #   重點趨勢的文章
│   ├── weekly-summaries.json        #   30 秒看趨勢
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
2. 在 `ai-newsletter-dashboard.html` 上右鍵 → `Open with Live Server`
3. 瀏覽器自動開啟 http://127.0.0.1:5500/ai-newsletter-dashboard.html

或用 Python：

```bash
python -m http.server 8000
# 然後開 http://localhost:8000/ai-newsletter-dashboard.html
```

---

## 📄 分頁與資料對應

| 分頁 | HTML 區段 ID | 資料來源 | JS 渲染函式 |
|------|------------|---------|------------|
| 首頁 | `#page-home` | `articles.json` + `weekly-summaries.json` | `renderSummaryItem()` |
| 重點趨勢 | `#page-news` | `articles.json` | trendGrid loop |
| 30 秒看趨勢 | `#page-summaries` | `weekly-summaries.json` | `renderSummaryItem()` |
| Prompt 技巧分享 | `#page-prompt-tips` | 內嵌 JS 資料（`promptData`） | promptContainer |
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

### 自動偵測
進入頁面時自動填好：
- **月份標題**：從最新一筆日期推算 `YYYY 年 M 月號`
- **重點趨勢（篇）**：`window.__articles.length`（全部）
- **30 秒趨勢（篇）**：`window.__weeklySummaries.length`（全部）

本期重點分成四個篇數欄位：重點趨勢 / Prompt 技巧分享 / AI 工具介紹 / 30 秒趨勢。
其中 Prompt 技巧分享、AI 工具介紹預設為 0，需手動填；重點趨勢與 30 秒趨勢會自動帶入。
使用者可手動覆寫所有欄位，覆寫後不會被自動填回去。

### 工作流程
1. 編輯 `data/articles.json` + `data/weekly-summaries.json`（首頁會即時更新）
2. 開 `#outlook-gen` → 自動產出當前 email HTML
3. 預覽 OK 後按「複製 HTML」
4. Outlook 開新郵件 → HTML 編輯模式 → 貼上 → 寄

### 設計來源
參考舊版手動模板 `tvbs-ai-newsletter/outlook version/018foroutlook.html`，視覺風格對齊新 dashboard 的 light theme（白底 + 紫色品牌色 + tag 色票編碼）。

### 相關程式碼
- HTML 區段：`ai-newsletter-dashboard.html` 內的 `<div id="page-outlook-gen">`
- 樣式：`dashboard.css` 內 `/* Outlook 版本產生器 */` 區段（class 前綴 `.og-*`）
- 邏輯：`dashboard.js` 內 `initOutlookGenerator()`、`ogBuildEmailHTML()`、`ogGenerate()` 等

---

## 🏷 標籤系統（雙層 tag）

`articles.json` 與 `weekly-summaries.json` 的每筆條目都應該有兩個欄位：

```json
{
  "tag": "新工具",
  "tags": ["程式設計", "工作流整合"]
}
```

### 第一層：內容屬性 `tag`（6 選 1）

| Tag | 適用 | 色票（CSS var） |
|-----|------|-----------------|
| 模型發布 | 新 LLM / 基礎模型 | `--tag-model` 藍 |
| 新工具 | 全新工具/服務「首次」上線 | `--tag-tool` 橙 |
| 新功能 | 既有產品的新版本 | `--tag-feature` 綠 |
| 應用技巧 | 教學 / 案例 | `--tag-tip` 青 |
| 產業動態 | 公司新聞、市場 | `--tag-industry` 灰 |
| 法律規範 | 政策、訴訟、合規 | `--tag-legal` 紅 |

判斷邊界：
- 模型 vs 新工具 → 「底層模型」 vs 「面向使用者的應用」
- 新工具 vs 新功能 → 「首次推出」 vs 「現有產品升級」
- Agent 性質：屬性而非新聞類型，agent 工具仍歸類為新工具（首發）或新功能（升級）

### 第二層：適用情境 `tags`（13 選 1-4 個）

固定順序（顯示順序）：

```
圖像生成、影片製作、聲音處理、寫作協助、即時翻譯、
自動化、工作流整合、整理資料、簡報設計、資料研究、
程式設計、訪談記錄、觀念學習
```

特殊規則：
- 「觀念學習」專給「不能直接用、但讀者該知道」的資訊型文章
- 「法律規範」只當第一層 `tag`，不放進 `tags`

> 詳細規則：`C:\Users\ed\.claude\projects\.../memory/tag_taxonomy.md`

---

## ➕ 新增內容指南

### 新增「重點趨勢」文章

編輯 `data/articles.json`：

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
- **`id` 命名規則**：純語意 slug、全小寫、連字號分隔（如 `gpt-image-2`），**不加期數前綴**。articles / weekly-summaries / tool-intro 三種來源共用同一套 slug 命名空間，全站唯一即可。外部（Outlook email）連回文章用 `#article-{id}`，dashboard 載入時會自動開對應 modal

### 新增「30 秒看趨勢」條目

編輯 `data/weekly-summaries.json`：

```json
{
  "id": "some-unique-id",
  "title": "標題",
  "date": "2026-05-10",
  "tag": "模型發布",
  "tags": ["程式設計"],
  "summary": "簡短描述",
  "sourceUrl": "https://...",
  "img": "https://..."
}
```

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
- 區塊垂直堆疊：Masthead → Overview band → Hero → 30秒看趨勢 → 內部工具 → 黑客松
- 每個區塊間用細短分隔線 `<hr class="reader-divider">` 區分
- 樣式集中在 dashboard.css 的 `/* Document Reader Mode */` 區段

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

搜尋邏輯在 `dashboard.js` 約 1024 行的 `doSearch()`：

- 搜尋 title + content 欄位
- 排序：**有日期者依日期 desc**，沒日期者（舊期）依**期號 desc**
- 結果顯示來源標籤（`getSearchSourceLabel()`），對應到分頁類別

搜尋會打到 **同一個** `searchIndex` array，這個 array 在初始載入時集合了：

1. `tvbs-ai-newsletter/search-index.json`（舊期內容）
2. 然後 push 進新 articles / summaries / tool-intros

所以搜尋會涵蓋全站內容。

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
→ Archived `tvbs-ai-newsletter/ai-newsletter-dashboard.html` 也建議同步。

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
