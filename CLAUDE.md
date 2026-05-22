# TVBS AI Knowledge Base — 專案規範

此文件給 Claude Code 自動載入，作為所有對話的專案知識基礎。內容偏「治理規則」與「分類體系」，與程式碼變動同步維護。

## 專案概覽

TVBS AI 電子報延伸的知識庫網站，正式環境 https://ainews.tvbs.ai/。

**主要系統**
- `ai-newsletter-dashboard.html` + `dashboard.js` + `dashboard.css` — 主站 SPA dashboard
- `data/*.json` — 內容資料來源
  - `data/articles.json` — 重點趨勢（原生長文）
  - `data/weekly-summaries.json` — 10 秒看趨勢
  - `data/prompt-tips.json` — Prompt 技巧分享
  - `data/tool-intro.json` — AI 工具介紹
- `admin/` — Sveltia CMS 後台（編輯 data/*.json 不用碰程式碼）
- `tvbs-ai-newsletter/` — 舊版電子報 HTML 系統（issues/001-018），有獨立 CLAUDE.md，於該目錄內開對話時請參考

**部署**
- 正式環境：Zeabur，從 `release` 分支自動部署 → https://ainews.tvbs.ai/
- 分支策略：feature → PR 到 `main`（整合 + 預覽）→ 累積後再從 `main` 開 PR 到 `release`（promote）才會上 production
- `main` push 不會直接上正式，必須 promote 到 `release` 才會觸發 Zeabur 部署
- promote commit 訊息慣例：`release: promote PR #N (...)` 或 `release: promote PR #N + #M (...)`（merge commit 形式）
- 判斷某 PR 有沒有上 production，不是看是否 merge 到 main，是看是否進到 `release`

---

## 內容分類標籤系統

站內 4 種 content 類型的 tag 結構不同，依本質設計。任何 tag 變動（新增/改名/移除）都要三處同步：
1. JSON data 檔的 `tag` 欄位（或現有條目的內容）
2. `admin/config.yml` 對應 collection 的 select options
3. `ai-newsletter-dashboard.html` 對應分頁的篩選 chip buttons

### 1. 10 秒看趨勢 + 重點趨勢（雙層 tag）

`data/weekly-summaries.json`（10 秒看趨勢）與 `data/articles.json`（重點趨勢）共用同一套雙層分類。

**第一層：內容屬性 `tag`（單一字串）**

| Tag | 適用 |
|-----|------|
| 模型發布 | 新 LLM / 基礎模型推出 |
| 新工具 | 全新工具 / 服務 / 系統上線（首次推出，包含 agent 性質的新工具如 Manus、Devin） |
| 新功能 | 既有產品的新功能 / 新版本（包含現有產品加入 agent 模式） |
| 應用技巧 | 教學 / how-to / 應用案例 |
| 產業動態 | 公司新聞、合作、走向、市場分析 |
| 法律規範 | 政策、訴訟、合規新聞 |

**命名規則**：tag 不加「AI」前綴（整個 newsletter 都是 AI，贅字）。早期版本曾用「AI 工具」「AI 代理」，2026-05 已 rename 為「新工具」。「自主代理」tag 也於 2026-05 移除 — agent 是產品「屬性」而非新聞「類型」，agent 新聞依本質歸入新工具（首發）或新功能（升級）。「AI 工具 ▾」現在只剩導覽列選單名，跟內容 tag 不衝突。

**第二層：適用情境 `tags`（陣列，多選）— 告訴讀者「能幫你做什麼工作」**

```
寫作協助 / 圖像生成 / 影片製作 / 聲音處理 /
簡報設計 / 訪談記錄 / 資料研究 / 程式設計 /
即時翻譯 / 整理資料 / 自動化 / 工作流整合 / 觀念學習
```

「觀念學習」專給「不能直接用、但讀者該知道」的資訊型文章（法律新聞、產業趨勢、AI 倫理等）。

「法律規範」只用在第一層內容屬性，不放進 `tags`（曾經跟第二層重複，已決議拿掉）。

**Why 雙層：** 讓非技術同事一眼分辨「這是哪類新聞」（第一層）+「這對我工作有什麼幫助」（第二層）。單層 tag 無法同時承載這兩種資訊。

**How to apply:** 新增條目時兩個欄位都要填。第二層挑 1-4 個最相關的工作能力（不要全選湊數，每個 tag 都該真的對應到文章描述）。

**選 tags 嚴格對應原文明寫的應用場景，不要從產品類型推斷：**
- 反例：原文只講「即時語音模型 + 辨識語調 + 自訂角色」就推斷加上「即時翻譯」「訪談記錄」— 這些場景原文沒提
- 正例：原文哪句話寫到什麼場景，tags 才放對應那個
- 常見要避開的推斷陷阱：
  - 「即時語音模型」→ 不自動 = 即時翻譯 / 訪談記錄
  - 「AI 代理人」→ 不自動 = 自動化 / 工作流整合
  - 「生圖模型」→ 不自動 = 簡報設計 / 設計創作
- 寧可 tags 只放 1-2 個（如果文章只描述單一場景），也不要湊到 3-4 個。tag 少不是缺點，是準確度。

### 2. Prompt 技巧分享（單層 tag）

`data/prompt-tips.json` 只用單層 `tag`（單一字串，非陣列），共 4 分類：

| Tag | 適用 |
|-----|------|
| 基礎入門 | Prompt 是什麼、基本架構公式（如「角色+任務+產出」「任務+行為+目標」）、新手必懂概念 |
| 情境應用 | 結合具體生活/工作場景的 prompt 範例集（旅遊規劃、學習計畫、運動訓練等） |
| 進階優化 | 改善/重寫既有 prompt 的方法、特定模型的撰寫技巧、優化工具介紹（如 Prompt Optimizer） |
| 生圖指令 | 圖像生成模型專用 prompt 樣板、生圖提示詞集（Gemini Flash Image、Nano Banana 等） |

**Why 單層：** Prompt 文章本身屬性單純（都是「教 prompt 怎麼下」），用單層分類已足夠；雙層會過度設計。tag 依「學習路徑」分層：基礎入門 → 情境應用/生圖指令（具體應用）→ 進階優化（進階技巧）。

**命名歷史**：2026-05 前是「優化技巧 / 模型技巧」兩個分類，前者跟分頁標題「Prompt 技巧分享」字面重複，後者只有 1 篇文章（GPT-5 prompting）顯多餘 — 已 rename 為「進階優化」並把模型相關技巧併入（「針對特定模型優化 prompt」本質就是優化）。

**How to apply:** 新增 prompt 文章時按以下判斷流程選 tag：
1. 教 prompt 基本概念/公式 → 基礎入門
2. 生圖相關 prompt → 生圖指令
3. 介紹具體生活/工作情境怎麼用 prompt → 情境應用
4. 怎麼讓既有 prompt 寫得更好（含工具或方法） → 進階優化

### 3. AI 工具介紹（單層 tag）

`data/tool-intro.json` 用單層 `tag`（2026-05 從 `cat` rename 為 `tag` 統一欄位命名），分類全部對應「工具用途/應用情境」，目前選項：應用技巧 / 代理操作 / 影片生成 / 筆記知識 / 設計創作 / 簡報設計 / 對話助理 / 搜尋研究 / 影音處理 / 工具教學 / 多模態 / 寫程式。

**命名歷史**：原本有「新工具」tag 過於籠統（只描述「這是新的」、沒說用途），2026-05 已移除並 rename 為「代理操作」— 對應 AI agent 類工具（Antigravity、Claude Computer Use、Operator 等）。整套分類本質是「這個工具能幫你做什麼」，跟 10 秒看趨勢/重點趨勢的新聞型 tag（描述新聞類型）設計目的不同。

---

## 舊文資料治理政策

跨所有 collection（重點趨勢/10 秒看趨勢/Prompt 技巧分享/AI 工具介紹）的內容資料治理原則：

**舊文章維持原狀**，包含但不限於：
- 缺少 `id` 欄位（例：tool-intro.json 21 篇中有 20 篇沒 id，2026-05 確認不補）
- 舊樣式 inline style 滿天飛（搬遷自 issues HTML 的 legacy content）
- search-index.json 裡開合不對稱的 `<div>` 結構
- 缺 `imgCaption`、`sourceUrl` 等欄位

**新文章一律走 CMS 標準**：
- 透過 `admin/` Sveltia 後台新增
- 所有 schema-required 欄位都會填上（id、title、date、tag 等）
- 內文使用 CSS class（如 `.prompt-quote`、`.callout-warn`、`.scenario-card`），不再用 inline style

**Why:** 一次性回補舊資料的成本（時間 + 出錯風險）遠高於價值。新內容用標準流程上稿後，歷史資料的影響會逐漸稀釋。CMS 介面 hint 已經補上各 collection 的 id 範例 + 內文可用 class 清單，新編輯者跟著做就會自然產出規範資料。

**How to apply:** 之後如果發現「某 collection 舊資料缺什麼」，預設不主動回補；除非該欄位缺失導致現有功能壞掉（例：渲染崩版、anchor link 失效造成 404），才針對性處理。維護精力集中在新內容上稿流程與 schema 設計。
