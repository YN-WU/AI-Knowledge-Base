# TVBS AI Newsletter 📰

> TVBS AI 未來科技部的 AI 科技電子報網站

## 📋 專案簡介

這是一個由 TVBS AI 未來科技部製作的 AI 科技電子報網站，定期發布 AI 領域的最新資訊、技術分析、工具介紹和產業動態。

**線上網站：** https://ainews.tvbs.ai/

## ✨ 主要功能

- 📰 **電子報瀏覽** - 每期精選 AI 新聞與深度分析
- 🔍 **全站搜尋** - 使用 Fuse.js 實現智能搜尋功能
- 🎯 **快速導覽** - 提供快速跳轉到各個章節的導覽列
- 📱 **響應式設計** - 支援桌面、平板、手機等多種裝置
- 📊 **數據追蹤** - 整合 Google Analytics (GTM) 進行數據分析
- 📧 **Outlook 範本** - 提供電子郵件發送版本

## 🗂️ 專案結構

```
TVBS AI Newsletter/
├── index.html              # 首頁（自動跳轉到最新一期）
├── scripts.js              # 主要 JavaScript 功能
├── style.css               # 網站樣式表
├── search-index.json       # 搜尋索引資料
├── issues/                 # 各期電子報內容
│   ├── 001.html           # 第 001 期（2025年4月）
│   ├── 002.html           # 第 002 期（2025年4月）
│   ├── ...
│   └── 013.html           # 最新期數
├── news_section.html       # 新聞區塊模板
├── Templat_for_outlook.html # Outlook 郵件範本
├── add_h3_ids.py          # 自動添加 h3 標籤 ID 的工具
├── update_search_index.js  # 更新搜尋索引的工具
├── validate_json.py        # JSON 格式驗證工具
└── README.md              # 專案說明文件
```

## 🚀 快速開始

### 直接開啟

1. Clone 此專案到本地：
```bash
git clone https://github.com/TVBS-AI/tvbs-ai-newsletter.git
cd tvbs-ai-newsletter
```

2. 使用瀏覽器開啟 `index.html` 或任何一期的電子報檔案

### 使用本地伺服器（推薦）

使用 Python 啟動簡易伺服器：
```bash
# Python 3
python -m http.server 8000

# 或使用 Python 2
python -m SimpleHTTPServer 8000
```

然後在瀏覽器中開啟 `http://localhost:8000`

## 📝 新增期數指南

### 1. 建立新的期數檔案

1. 複製最新一期的 HTML 檔案（例如 `issues/012.html`）
2. 重新命名為新的期數（例如 `issues/013.html`）
3. 更新檔案內的內容

### 2. 更新 scripts.js

在 [`scripts.js`](scripts.js:6) 中更新以下設定：

```javascript
// 更新最新期數
const latestIssueValue = '013'; // 改為新的期數

// 在 issuesData 陣列中新增新期數
const issuesData = [
    // ... 現有期數
    { value: '013', text: '第013期 | 2025年10月' },  // 新增這行
];
```

### 3. 更新首頁跳轉

修改 [`index.html`](index.html:14) 中的自動跳轉設定：

```html
<meta http-equiv="refresh" content="0; url=./issues/013.html">
```

### 4. 更新搜尋索引

在 `search-index.json` 中新增新期數的內容索引，格式如下：

```json
{
  "title": "文章標題",
  "content": "文章摘要或關鍵內容",
  "url": "./issues/013.html#section-jump-0"
}
```

## 🛠️ 工具說明

### add_h3_ids.py

自動為所有 HTML 檔案中的 `<h3>` 標籤添加 ID 屬性，方便快速導覽功能使用。

```bash
python add_h3_ids.py
```

### update_search_index.js

Node.js 腳本，用於批量更新搜尋索引中的 URL 錨點。

```bash
node update_search_index.js
```

### validate_json.py

驗證 JSON 檔案格式是否正確。

```bash
python validate_json.py
```

## 🎨 自訂樣式

主要樣式定義在 [`style.css`](style.css:1) 中，包含：

- **顏色主題** - 紫色系設計 (`#6b4e9d`)
- **響應式斷點** - 適配各種螢幕尺寸
- **動畫效果** - 滾動動畫、數字滾動效果等
- **佈局系統** - Flexbox 和 Grid 佈局

## 📧 Outlook 電子郵件範本

[`Templat_for_outlook.html`](Templat_for_outlook.html:1) 提供了適用於 Outlook 的電子郵件範本，可用於：

- 電子報發送通知
- 新期數上線通知
- 重點內容摘要

## 🔍 搜尋功能

搜尋功能使用 [Fuse.js](https://fusejs.io/) 實現：

- **模糊搜尋** - 支援拼字錯誤容錯
- **即時搜尋** - 輸入時即時顯示結果
- **相關度排序** - 根據相關性排序搜尋結果
- **跨期搜尋** - 可搜尋所有期數的內容

## 📊 數據分析

整合 Google Tag Manager (GTM-5FPJBLQJ)，追蹤以下事件：

- 頁面瀏覽
- 外部連結點擊
- 期數切換
- 搜尋查詢

## 🌐 瀏覽器支援

- ✅ Chrome (最新版)
- ✅ Firefox (最新版)
- ✅ Safari (最新版)
- ✅ Edge (最新版)
- ⚠️ IE11 (部分功能可能不支援)

## 📱 響應式設計斷點

- **手機** - < 768px
- **平板** - 768px ~ 1024px
- **桌面** - > 1024px

## 🤝 貢獻指南

歡迎提交 Issue 或 Pull Request！

1. Fork 此專案
2. 建立您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 📄 授權

Copyright © 2025 TVBS AI 未來科技部 | 聯利媒體股份有限公司

## 📞 聯絡資訊

如有任何問題或建議，請聯繫 TVBS AI 未來科技部。

---

**Made with ❤️ by TVBS AI Team**