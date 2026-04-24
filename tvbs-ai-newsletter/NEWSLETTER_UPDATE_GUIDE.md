ˇ# AI Newsletter 新期数发布指南

## 📋 概述
本文档说明如何为 AI Newsletter 项目添加新的一期内容。请严格按照以下步骤操作，确保所有文件正确更新。

---

## 🔢 更新步骤

### 步骤 1️⃣：创建新期数的 HTML 文件

**文件位置：** `issues/XXX.html`（XXX 为期数，如 014）

**重要提醒：**
- ✅ **必须使用标准的 HTML 结构，参考 `issues/012.html` 或 `issues/013.html`**
- ✅ **不要手动添加 section ID**（如 `id="prompt-column"`），让 JavaScript 自动生成 `section-jump-X`
- ✅ **必须包含以下 class 结构：**
  - 新闻项目使用 `<div class="news-item">`
  - 专栏/工具推荐使用 `<section class="section">`
  - 精选新闻使用 `<section class="section news-roundup">`
- ✅ **新闻标题使用 `<h3>` 标签**
- ✅ **避免 HTML 语法错误**（如未闭合的标签、重复的代码）

**必要元素：**
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <script>(function(w,d,s,l,i){...GTM代码...})</script>
    <title>AI NEWS LETTER - 第XXX期</title>
    <link rel="stylesheet" href="../style.css">
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@6.6.2"></script>
</head>
<body>
    <!-- 快速跳转导航 -->
    <nav class="quick-jump-nav" id="quickJumpNav">
        <h4>本期目錄</h4>
        <ul id="quickJumpList"></ul>
    </nav>
    <button class="quick-jump-toggle" id="quickJumpToggle">目錄</button>

    <div class="newsletter-container">
        <header class="header">
            <h1>AI NEWS LETTER</h1>
            <p>第XXX期 | YYYY年MM月</p>
            <!-- 搜索框 -->
        </header>

        <!-- 期数选择器 -->
        <div class="period-selector-container">...</div>
        
        <!-- 重点摘要 -->
        <div class="outline-box">...</div>

        <!-- 新闻项目（不要添加手动ID） -->
        <div class="news-item">
            <h3>新闻标题</h3>
            ...
        </div>

        <!-- 专栏区块（不要添加手动ID） -->
        <section class="section">
            <h2 class="section-title">💡Prompt 專欄</h2>
            ...
        </section>

        <!-- AI工具推荐（不要添加手动ID） -->
        <section class="section">
            <h2 class="section-title">🛠️ AI 工具推薦</h2>
            ...
        </section>

        <!-- 精选新闻（不要添加手动ID） -->
        <section class="section news-roundup">
            <h2 class="section-title">AI 科技精選新聞</h2>
            ...
        </section>

        <!-- 社群连结 -->
        <section class="social-connect-section">...</section>

        <!-- Footer -->
        <footer>...</footer>
    </div>

    <script src="../scripts.js"></script>
</body>
</html>
```

---

### 步骤 2️⃣：创建下一期的 Coming Soon 占位页

**文件位置：** `issues/XXX.html`（XXX 为下一期期数，如当前是 014，则创建 015）

**模板：**
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <script>(function(w,d,s,l,i){...GTM代码...})</script>
    <title>AI NEWS LETTER - 第XXX期</title>
    <link rel="stylesheet" href="../style.css">
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@6.6.2"></script>
</head>
<body>
    <nav class="quick-jump-nav" id="quickJumpNav">
        <h4>本期目錄</h4>
        <ul id="quickJumpList"></ul>
    </nav>
    <button class="quick-jump-toggle" id="quickJumpToggle">目錄</button>

    <div class="newsletter-container">
        <header class="header">
            <h1>AI NEWS LETTER</h1>
            <p>第XXX期 | Coming soon</p>
            <div class="search-container">
                <input type="search" id="searchInput" placeholder="搜尋本站所有文章...">
                <div id="searchResults" class="search-results-container"></div>
            </div>
        </header>

        <div class="period-selector-container">
            <div class="period-selector">
                <select id="periodSelect"></select>
            </div>
        </div>

        <div style="text-align: center; padding: 100px 20px; min-height: 400px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: rgba(255, 255, 255, 0.9); padding: 60px 40px; border-radius: 20px; box-shadow: 0 8px 32px rgba(107, 78, 157, 0.15);">
                <div style="font-size: 80px; margin-bottom: 20px;">📰</div>
                <h2 style="color: #6b4e9d; font-size: 2em; margin-bottom: 20px;">第XXX期即將推出</h2>
                <p style="font-size: 1.2em; color: #666; line-height: 1.8; margin-bottom: 30px;">
                    我們正在精心準備最新一期的 AI 科技新聞與深度分析，<br>敬請期待！
                </p>
                <div style="margin-top: 40px;">
                    <a href="./YYY.html" style="display: inline-block; padding: 15px 40px; background-color: #6b4e9d; color: white; text-decoration: none; border-radius: 30px; font-size: 1.1em; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(107, 78, 157, 0.3);">
                        ← 查看上一期
                    </a>
                </div>
            </div>
        </div>

        <section class="social-connect-section">...</section>
        <footer>...</footer>
    </div>
    
    <script src="../scripts.js"></script>
</body>
</html>
```

---

### 步骤 3️⃣：更新首页 (index.html)

**需要修改的位置：**

1. **第14行** - meta refresh 跳转
   ```html
   <!-- 修改前 -->
   <meta http-equiv="refresh" content="0; url=./issues/012.html">
   
   <!-- 修改后（假设新期数是 013） -->
   <meta http-equiv="refresh" content="0; url=./issues/013.html">
   ```

2. **第83行** - 备用连结
   ```html
   <!-- 修改前 -->
   <p class="fallback-link">如果頁面沒有自動跳轉，請<a href="/issues/012.html">點擊這裡</a>。</p>
   
   <!-- 修改后 -->
   <p class="fallback-link">如果頁面沒有自動跳轉，請<a href="/issues/013.html">點擊這裡</a>。</p>
   ```

---

### 步骤 4️⃣：更新 JavaScript (scripts.js)

**⚠️ 重要：检查第1行是否有语法错误！**

**需要修改的位置：**

1. **第1行** - 确保注释符号正确
   ```javascript
   // scripts.js (電子報專用 - 最終整合版 v4) - 2025-08-14
   // ❌ 错误：ㄨㄣ scripts.js...
   // ✅ 正确：// scripts.js...
   ```

2. **第6行** - 更新最新期数
   ```javascript
   // 修改前
   const latestIssueValue = '012';
   
   // 修改后（假设新期数是 013）
   const latestIssueValue = '013';
   ```

3. **第10-25行** - 在 issuesData 数组中添加新期数
   ```javascript
   const issuesData = [
       { value: '001', text: '第001期 | 2025年4月' },
       // ... 其他期数 ...
       { value: '012', text: '第012期 | 2025年9月' },
       { value: '013', text: '第013期 | 2025年10月' },  // ← 新增当前期
       { value: '014', text: '第014期 | Coming soon' }   // ← 新增下一期占位
   ];
   ```

---

### 步骤 5️⃣：更新搜索索引 (search-index.json)

**⚠️ 重要：使用 `#section-jump-X` 格式，不要使用自定义ID！**

**添加位置：** 在文件末尾的 `]` 之前添加新期数的索引

**格式规则：**
- 本期重点摘要 → `/issues/XXX.html`（无锚点）
- 第1篇新闻 → `/issues/XXX.html#section-jump-0`
- 第2篇新闻 → `/issues/XXX.html#section-jump-1`
- 第3篇新闻 → `/issues/XXX.html#section-jump-2`
- 第4篇新闻 → `/issues/XXX.html#section-jump-3`
- Prompt专栏 → `/issues/XXX.html#section-jump-4`
- AI工具推荐 → `/issues/XXX.html#section-jump-5`
- 精选新闻 → `/issues/XXX.html#section-jump-6`

**示例：**
```json
,
  {
    "title": "本期重點摘要",
    "content": "简短描述本期重点内容...",
    "url": "/issues/013.html"
  },
  {
    "title": "第一篇新闻标题",
    "content": "新闻摘要内容...",
    "url": "/issues/013.html#section-jump-0"
  },
  {
    "title": "第二篇新闻标题",
    "content": "新闻摘要内容...",
    "url": "/issues/013.html#section-jump-1"
  },
  {
    "title": "第三篇新闻标题",
    "content": "新闻摘要内容...",
    "url": "/issues/013.html#section-jump-2"
  },
  {
    "title": "第四篇新闻标题",
    "content": "新闻摘要内容...",
    "url": "/issues/013.html#section-jump-3"
  },
  {
    "title": "💡Prompt 專欄：标题",
    "content": "专栏内容摘要...",
    "url": "/issues/013.html#section-jump-4"
  },
  {
    "title": "🛠️ AI 工具推薦：工具名称",
    "content": "工具介绍摘要...",
    "url": "/issues/013.html#section-jump-5"
  },
  {
    "title": "AI 科技精選新聞",
    "content": "包含的新闻列表...",
    "url": "/issues/013.html#section-jump-6"
  }
]
```

---

## ⚠️ 常见错误与注意事项

### ❌ 错误 1：手动添加 section ID
```html
<!-- ❌ 错误 -->
<section class="section" id="prompt-column">

<!-- ✅ 正确 -->
<section class="section">
```
**原因：** JavaScript 会自动为所有 `.news-item` 和 `.section` 生成 `section-jump-X` 格式的ID，手动ID会导致冲突。

---

### ❌ 错误 2：搜索索引使用错误的锚点格式
```json
// ❌ 错误
"url": "/issues/013.html#chatgpt-platform-evolution"

// ✅ 正确
"url": "/issues/013.html#section-jump-0"
```
**原因：** JavaScript 自动生成的ID格式是 `section-jump-X`，自定义锚点不会跳转。

---

### ❌ 错误 3：scripts.js 第1行注释符号错误
```javascript
// ❌ 错误（乱码）
ㄨㄣ scripts.js (電子報專用...

// ✅ 正确
// scripts.js (電子報專用...
```
**影响：** 会导致整个 JavaScript 文件无法执行，下拉选单不会显示。

---

### ❌ 错误 4：HTML 结构错误
```html
<!-- ❌ 错误：重复的代码 -->
<div style="margin: 15px 0;">
 15px 0;">
    <img src="..." />
</div>

<!-- ✅ 正确 -->
<div style="margin: 15px 0;">
    <img src="..." />
</div>
```
**影响：** 会导致 HTML 渲染错误，JavaScript 无法正确生成目录。

---

### ❌ 错误 5：忘记更新 Coming Soon 页面
**必须同时创建：**
- 当前期数的完整内容（如 `013.html`）
- 下一期的占位页面（如 `014.html`）

---

## ✅ 更新检查清单

更新完成后，请逐一检查以下项目：

- [ ] `issues/XXX.html` - 新期数HTML文件已创建
- [ ] `issues/YYY.html` - 下一期Coming Soon页面已创建
- [ ] `index.html` - 第14行和第83行已更新为最新期数
- [ ] `scripts.js` - 第1行注释符号正确（`//`）
- [ ] `scripts.js` - 第6行 `latestIssueValue` 已更新
- [ ] `scripts.js` - `issuesData` 数组已添加新期数和下一期占位
- [ ] `search-index.json` - 已添加新期数的所有搜索索引
- [ ] `search-index.json` - 所有URL使用正确的 `#section-jump-X` 格式
- [ ] HTML文件中没有手动添加的section ID
- [ ] HTML文件包含正确的class结构（`.news-item`, `.section`）
- [ ] 测试下拉选单是否正常显示
- [ ] 测试右侧快速跳转目录是否自动生成
- [ ] 测试搜索功能是否能正确跳转

---

## 📊 section-jump-X 对应关系

假设一期newsletter包含以下内容：

| 内容类型 | JavaScript生成的ID | 搜索索引URL |
|---------|-------------------|------------|
| 第1篇新闻 | `section-jump-0` | `/issues/XXX.html#section-jump-0` |
| 第2篇新闻 | `section-jump-1` | `/issues/XXX.html#section-jump-1` |
| 第3篇新闻 | `section-jump-2` | `/issues/XXX.html#section-jump-2` |
| 第4篇新闻 | `section-jump-3` | `/issues/XXX.html#section-jump-3` |
| Prompt专栏 | `section-jump-4` | `/issues/XXX.html#section-jump-4` |
| AI工具推荐 | `section-jump-5` | `/issues/XXX.html#section-jump-5` |
| 精选新闻 | `section-jump-6` | `/issues/XXX.html#section-jump-6` |

**计数规则：**
- 从 0 开始计数
- 按照HTML中 `.news-item` 和 `.section` 出现的顺序
- 跳过 `.social-connect-section`（社群连结区块不计入）

---

## 🔄 完整更新流程示例

**情境：**发布第 014 期

### 1. 创建文件
- 创建 `issues/014.html`（完整内容）
- 创建 `issues/015.html`（Coming Soon）

### 2. 更新 index.html
```html
<meta http-equiv="refresh" content="0; url=./issues/014.html">
```

### 3. 更新 scripts.js
```javascript
const latestIssueValue = '014';

const issuesData = [
    // ... 之前的期数 ...
    { value: '013', text: '第013期 | 2025年10月' },
    { value: '014', text: '第014期 | 2025年11月' },
    { value: '015', text: '第015期 | Coming soon' }
];
```

### 4. 更新 search-index.json
在最后的 `]` 之前添加：
```json
,
  {
    "title": "本期重點摘要",
    "content": "第014期重点...",
    "url": "/issues/014.html"
  },
  {
    "title": "第一篇新闻",
    "content": "内容摘要...",
    "url": "/issues/014.html#section-jump-0"
  }
  // ... 继续添加其他条目 ...
]
```

---

## 📝 最后提醒

1. **永远不要手动添加 section ID**
2. **搜索索引必须使用 `#section-jump-X` 格式**
3. **检查 scripts.js 第1行注释符号**
4. **确保HTML结构正确无重复代码**
5. **同时创建当前期和下一期的Coming Soon页面**
6. **更新完成后测试所有功能**

---

## 🆘 故障排除

### 问题：下拉选单不显示
**可能原因：**
- scripts.js 第1行语法错误
- issuesData 数组格式错误

### 问题：右侧目录不显示
**可能原因：**
- HTML 缺少 `.news-item` 或 `.section` class
- HTML 语法错误导致 JavaScript 无法执行

### 问题：搜索跳转不正确
**可能原因：**
- 使用了自定义ID而非 `#section-jump-X`
- section-jump-X 的数字计算错误

---

**文档版本：** v1.0  
**最后更新：** 2025-10-23  
**维护者：** TVBS AI 未来科技部