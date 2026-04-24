# TVBS AI Newsletter「On Air」— Claude 專案背景

## 專案簡介
TVBS AI 電子報，每期一份獨立 HTML 檔案，部署於 Netlify（https://tvbsainews.netlify.app/）。
目前已出版 001–018 期，019 為 Coming Soon 預留頁面。

---

## 目錄結構

```
on air/
├── index.html              # 首頁，meta refresh 自動跳轉至最新期
├── scripts.js              # 所有互動功能（搜尋、快速跳轉、動畫等）
├── style.css               # 全站樣式（2,400+ 行）
├── search-index.json       # 全站搜尋索引
├── issues/
│   ├── 001.html – 018.html # 已出版期數
│   ├── 019.html            # Coming Soon
│   ├── builder.js          # 通用模板建構腳本（模組化）
│   └── build-018.js        # 018 期專用建構腳本（內容內嵌）
├── outlook version/        # Outlook 版 email 模板（011–017）
├── add_h3_ids.py           # 自動為 h3 加上 ID 的 Python 工具
├── update_search_index.js  # 更新 search-index URL 的工具
└── validate_json.py        # 驗證 JSON 格式的工具
```

---

## 出新期 Checklist（每次出刊必做）

新增一期時，需手動更新以下 **3 個地方**：

1. **`scripts.js`**
   - 更新 `latestIssueValue` 為新期號（例如 `'019'`）
   - 在 `issuesData` 陣列頂部加入新期物件：
     ```js
     { value: '019', text: '第019期 | 2026年X月' },
     ```

2. **`index.html`**
   - 更新 `<meta http-equiv="refresh">` 的 URL 指向新期 HTML

3. **`search-index.json`**
   - 新增該期所有文章條目（格式見下方）

---

## HTML 結構規範

### 每期 HTML 基本骨架
```
GTM head script
→ nav#quickJumpNav（快速跳轉，由 scripts.js 自動填入）
→ .newsletter-container
   → header（標題、期號、搜尋框）
   → .period-selector-container（期數下拉選單）
   → .outline-box（本期重點摘要）
   → [N 個 .news-item]（主要文章）
   → section.section（AI 工具推薦）
   → section.section.news-roundup（AI 精選新聞）
   → .social-connect-section
   → footer
```

### 文章區塊（.news-item）
```html
<div class="news-item">
    <span class="tag">標籤1</span>
    <span class="tag">標籤2</span>
    <h3>文章標題</h3>
    <div class="news-content">
        <div class="news-image-top">
            <img src="圖片URL" alt="圖片說明">
            <p style="font-size:12px; color:#888888; font-style:italic; ...">圖說</p>
        </div>
        <div class="news-columns">
            <div class="column">左欄內容</div>
            <div class="column">右欄內容</div>
        </div>
        <div class="link-group">
            <a href="..." class="news-link">官方完整介紹 →</a>
        </div>
    </div>
</div>
```

### 小標題（文章內）
```html
<h4 style="color: #6b4e9d; margin: 20px 0 10px 0; font-size: 1.15em; font-weight: bold;">標題</h4>
```

---

## section-jump ID 說明

`scripts.js` 的 `initQuickJumpNav()` 函式會掃描所有 `.news-item` 和 `.section` 元素，
按出現順序自動分配 `id="section-jump-0"`、`section-jump-1`… 等 ID。

**018 期的 section-jump 對照：**
| ID | 內容 |
|----|------|
| section-jump-0 | Nano Banana 2 |
| section-jump-1 | Gemini 3.1 Pro |
| section-jump-2 | Gemini 3.1 Flash-Lite |
| section-jump-3 | Claude Sonnet 4.6 |
| section-jump-4 | ChatGPT Deep Research + Gemini 3 Deep Think |
| section-jump-5 | Seedance 2.0 + Vidu Q3 |
| section-jump-6 | Gemini + Lyria 3 |
| section-jump-7 | AI 工具推薦（Antigravity） |
| section-jump-8 | AI 精選新聞 |

---

## search-index.json 格式

每期需加入以下條目（每個 `section-jump-N` 對應一個）：

```json
{
  "title": "本期重點摘要 (0XX期)",
  "content": "摘要文字...",
  "url": "/issues/0XX.html"
},
{
  "title": "文章標題",
  "content": "文章摘要（100-200字）",
  "url": "/issues/0XX.html#section-jump-0"
}
```

---

## 重要 CSS Class 清單

| Class | 用途 |
|-------|------|
| `.news-item` | 主要文章容器 |
| `.news-columns` | 兩欄式文字佈局（grid） |
| `.column` | 兩欄中的單欄 |
| `.news-image-top` | 文章頂部圖片容器 |
| `.outline-box` | 本期重點摘要框 |
| `.section` | 通用區塊（AI 工具推薦、精選新聞等） |
| `.news-roundup` | 精選新聞容器 |
| `.roundup-grid-final` | 精選新聞圖片 Grid |
| `.roundup-image-link` | 單則精選新聞圖片連結 |
| `.tag` | 文章標籤（紫色小標籤） |
| `.news-link` | 文章底部連結按鈕 |
| `.notebook-feature-card` | AI 工具功能卡片 |
| `.stat-number` | 觸發數字滾動動畫的元素 |
| `.quick-jump-nav` | 左側快速跳轉導覽 |

---

## GTM 設定
所有頁面使用 Google Tag Manager ID：`GTM-5FPJBLQJ`

---

## 部署
- Git push 至 main → Netlify 自動部署
- 部署設定：`.netlify/netlify.toml`
