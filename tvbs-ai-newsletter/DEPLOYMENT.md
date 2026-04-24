# 📤 GitHub 部署指引

## 方法一：使用 GitHub Desktop（最簡單推薦）

### 步驟

1. **下載 GitHub Desktop**
   - 前往：https://desktop.github.com/
   - 下載並安裝

2. **登入 GitHub**
   - 開啟 GitHub Desktop
   - File > Options > Accounts
   - 登入您的 GitHub 帳號

3. **添加本地儲存庫**
   - File > Add local repository
   - 選擇此資料夾：`c:\Users\En-Yu\Desktop\TVBS\AI\AI News letter\on air`
   - 點擊 "Add repository"

4. **發布到 GitHub**
   - Repository > Repository settings
   - 確認 Remote 設定為：
     ```
     Remote name: origin
     URL: https://github.com/TVBS-AI/tvbs-ai-newsletter.git
     ```
   - 點擊 Save

5. **提交並推送**
   - 確認所有檔案都已選取
   - 在下方 Summary 輸入：`Initial commit: TVBS AI Newsletter project`
   - 點擊 "Commit to main"
   - 點擊上方的 "Push origin" 按鈕

---

## 方法二：使用 Git Bash（需安裝 Git）

### 前置準備

1. 安裝 Git for Windows：https://git-scm.com/download/win
2. 設定 Git 使用者資訊：
```bash
git config --global user.name "您的名字"
git config --global user.email "您的email@example.com"
```

### 執行命令

在專案資料夾中開啟 Git Bash，執行以下命令：

```bash
# 1. 確認狀態
git status

# 2. 添加所有檔案
git add .

# 3. 提交變更
git commit -m "Initial commit: TVBS AI Newsletter project"

# 4. 設定主分支名稱
git branch -M main

# 5. 推送到 GitHub
git push -u origin main
```

### 如果需要輸入認證

GitHub 已不再支援密碼登入，請使用 Personal Access Token：

1. 前往 GitHub：Settings > Developer settings > Personal access tokens > Tokens (classic)
2. 點擊 "Generate new token (classic)"
3. 勾選 `repo` 權限
4. 產生並複製 token
5. 推送時使用 token 作為密碼

---

## 方法三：直接上傳到 GitHub 網頁

1. 前往：https://github.com/TVBS-AI/tvbs-ai-newsletter
2. 點擊 "Add file" > "Upload files"
3. 將所有專案檔案拖曳到頁面
4. 輸入提交訊息：`Initial commit: TVBS AI Newsletter project`
5. 點擊 "Commit changes"

⚠️ **注意**：此方法不會保留 Git 歷史記錄

---

## ✅ 驗證部署成功

上傳完成後：

1. 前往：https://github.com/TVBS-AI/tvbs-ai-newsletter
2. 確認所有檔案都已上傳
3. 檢查 README.md 是否正確顯示

---

## 🔄 後續更新

當您修改檔案後，使用 GitHub Desktop：

1. 左側會自動顯示變更的檔案
2. 輸入變更說明
3. 點擊 "Commit to main"
4. 點擊 "Push origin"

或使用命令列：

```bash
git add .
git commit -m "更新說明"
git push
```

---

## 🆘 常見問題

### Q: Push 時出現 "Permission denied" 錯誤？
A: 確認您有該儲存庫的寫入權限，或使用正確的 Personal Access Token

### Q: 出現衝突（conflict）怎麼辦？
A: 
1. 使用 `git pull` 先拉取遠端最新版本
2. 解決衝突後再推送
3. 或使用 GitHub Desktop 的視覺化介面處理

### Q: 如何忽略某些檔案？
A: 已經創建了 `.gitignore` 檔案，可以在其中添加要忽略的檔案或資料夾

---

**需要協助？** 請參考 [README.md](README.md) 或聯繫 TVBS AI 團隊