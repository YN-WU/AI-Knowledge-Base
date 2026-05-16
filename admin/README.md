# 內容管理後台（CMS）使用說明

這個後台讓你不用碰程式碼，直接用表單編輯網站文章。

**後台入口**：`https://ainews.tvbs.ai/admin/`（不放在 nav，只能直接打網址進）

---

## 🔑 第一次使用：產生 GitHub Personal Access Token（PAT）

PAT 是「給後台用的 GitHub 專屬密碼」，產生一次貼進來就好，之後都不用再碰（除非過期）。

### 產生步驟

1. 登入 GitHub，點右上頭像 → **Settings**
2. 左邊選單最下面 → **Developer settings**
3. 左邊選單 → **Personal access tokens** → **Fine-grained tokens**
4. 點右上 **「Generate new token」**
5. 填寫：
   - **Token name**：`AI Newsletter CMS`（自取，方便記）
   - **Expiration**：建議 **1 year**（一年後要重做一次）
   - **Repository access**：選 **「Only select repositories」** → 勾選 `AI-Knowledge-Base`
   - **Repository permissions**：往下找 **「Contents」** → 改成 **「Read and write」**
6. 滑到最下面 → **「Generate token」**
7. **複製跳出來那串長長的 token**（離開頁面就看不到了，沒複製到要重產）

### 登入後台

1. 打開 `https://ainews.tvbs.ai/admin/`
2. 看到登入畫面 → 貼上剛剛複製的 token → 按登入
3. 進入後台。瀏覽器會記住 token，下次自動登入。

---

## 📝 日常使用：新增/編輯文章

進到後台會看到四個分類：
- **重點趨勢** — `data/articles.json`
- **10 秒看趨勢** — `data/weekly-summaries.json`
- **Prompt 技巧分享** — `data/prompt-tips.json`
- **AI 工具介紹** — `data/tool-intro.json`

### 新增一篇文章

1. 點分類 → 點「文章列表」（會看到所有現有文章）
2. 點下方 **「Add 文章」**
3. 填表單（每個欄位都有提示說明）
4. 右上角點 **「Publish」→「Publish now」**
5. 後台會自動 commit 進 GitHub
6. **2–5 分鐘後主站自動更新**（看你的 hosting deploy 速度）

### 編輯既有文章

1. 進到「文章列表」→ 點要改的那一筆 → 改 → Publish

### 刪除文章

1. 點要刪的那一筆 → 右上角下拉 → **「Delete entry」**

---

## ⚠️ 注意事項

### 圖片要先上傳到圖床
本專案的圖片**不存在這個 repo**，而是統一放在另一個 `ainews-images` repo（透過 jsDelivr CDN 出圖）。

新增文章時的「封面圖網址」欄位請貼這種格式：
```
https://cdn.jsdelivr.net/gh/YN-WU/ainews-images@main/images/你的檔名.png
```

圖片要先傳到 `github.com/YN-WU/ainews-images` 的 `images/` 資料夾，再回來填網址。

### ID 命名規則
純小寫、用連字號（`-`）連接、英數字。例如 `gpt-image-2`、`hermes-agent`、`notebooklm-audio-guide`。
**全站唯一**（articles、summaries、tool-intros 三類共用同一個 slug 命名空間）。

### 內文是 HTML 不是 Markdown
內文欄位請用 HTML 標籤（`<p>`、`<h4>`、`<ul>`、`<strong>` 等）。
第一段請用 `<p class="first-paragraph">…</p>`（首字會有特殊樣式）。

---

## 🛠 疑難排解

### PAT 過期 / 登入失敗
→ 照上面「產生步驟」重做一次，把新 token 貼進後台。

### 後台說我沒權限
→ 確認你的 GitHub 帳號有 `AI-Knowledge-Base` repo 的寫入權限，而且產 PAT 時 **Contents** 權限選了 **Read and write**。

### 改了文章但網站沒更新
→ 通常 2–5 分鐘會更新（hosting 自動 deploy）。如果超過 10 分鐘還沒，去 GitHub 上看 Actions 是不是 build 失敗。

---

## 💻 本機測試 CMS（不用 PAT、不推 GitHub）

當你還沒準備好正式上線、只想在自己電腦上預覽修改效果，用本機模式最方便。改動會直接寫到本機 `data/*.json`，不會碰到 GitHub。

### 一次性準備

需要先安裝 [Node.js](https://nodejs.org/zh-tw/)（LTS 版本即可），裝過就跳過。

### 每次啟動步驟

**Step 1：開第一個 PowerShell 視窗（CMS 代理）**

在 VS Code 按 `` Ctrl + ` `` 開 terminal，或從開始選單搜尋「PowerShell」。

```powershell
cd "C:\Users\ed\Desktop\cowork\AI NEWS LETTER"
npx decap-server
```

第一次跑會問是否下載套件，輸入 `y` 按 Enter。
看到 `Decap CMS Proxy Server listening on port 8081` 就 OK。
**這個視窗不要關**。

**Step 2：開第二個 PowerShell 視窗（網頁伺服器）**

```powershell
cd "C:\Users\ed\Desktop\cowork\AI NEWS LETTER"
npx serve .
```

第一次跑也會問下載，輸入 `y` 按 Enter。
看到綠框 `Serving!` 跟 `Local: http://localhost:3000` 就 OK。
**這個視窗也不要關**。

**Step 3：用瀏覽器打開**

```
http://localhost:3000/admin/
```

⚠️ 注意網址結尾的 `/admin/` 一定要有，少了會 404。

進去後 Sveltia CMS 會自動偵測本機模式，不需登入，直接看到四個 collection 可以編輯。存檔會即時寫到本機的 `data/*.json`。

### 關掉的方法

兩個 PowerShell 視窗各按 `Ctrl + C` 停掉就好。要重開再從 Step 1 開始。

### 常見問題

- **`/admin/` 顯示 404** — 通常是 `npx serve .` 不是在專案資料夾跑的。用 `pwd` 確認，必要時用 `cd "C:\Users\ed\Desktop\cowork\AI NEWS LETTER"` 切過去再重新跑。
- **port 3000 被占用** — `npx serve .` 會自動換 port（看終端機顯示的數字為準）。
- **CMS 跳出 `widget: date` 不支援錯誤** — Sveltia 已停用舊版 `date` widget，要改成 `widget: datetime` 並加 `time_format: false`。config.yml 目前已修正，若日後新增 collection 注意這個。
