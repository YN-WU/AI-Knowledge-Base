# 🤝 貢獻指南

感謝您對 TVBS AI Newsletter 專案的關注！

## 📋 如何貢獻

### 報告問題

如果您發現了 bug 或有功能建議：

1. 前往 [Issues 頁面](https://github.com/TVBS-AI/tvbs-ai-newsletter/issues)
2. 點擊 "New Issue"
3. 選擇適當的模板（Bug Report 或 Feature Request）
4. 填寫詳細資訊
5. 提交 Issue

### 提交程式碼

1. **Fork 此專案**
   ```bash
   # 在 GitHub 上點擊 Fork 按鈕
   ```

2. **Clone 您的 Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/tvbs-ai-newsletter.git
   cd tvbs-ai-newsletter
   ```

3. **創建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **進行變更**
   - 遵循現有的程式碼風格
   - 添加必要的註釋
   - 測試您的變更

5. **提交變更**
   ```bash
   git add .
   git commit -m "Add: 簡短描述您的變更"
   ```

6. **推送到您的 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **建立 Pull Request**
   - 前往原始專案的 GitHub 頁面
   - 點擊 "New Pull Request"
   - 選擇您的分支
   - 填寫 PR 描述
   - 提交 Pull Request

## 📝 程式碼規範

### HTML

- 使用 2 個空格縮排
- 保持語義化標籤
- 添加適當的 alt 屬性到圖片
- 確保響應式設計

### CSS

- 使用有意義的類別名稱
- 遵循 BEM 命名規範（可選）
- 保持樣式模組化
- 添加必要的註釋

### JavaScript

- 使用 ES6+ 語法
- 添加清楚的函數註釋
- 保持函數簡潔單一職責
- 使用 const/let 而非 var

### Python

- 遵循 PEP 8 風格指南
- 添加 docstring 到函數
- 使用有意義的變數名稱

## 🔍 Commit 訊息規範

使用清楚的 commit 訊息：

- `Add:` 新增功能
- `Fix:` 修復 bug
- `Update:` 更新既有功能
- `Refactor:` 重構程式碼
- `Docs:` 文件更新
- `Style:` 程式碼格式調整
- `Test:` 測試相關

範例：
```
Add: 新增搜尋結果高亮功能
Fix: 修正手機版導覽列顯示問題
Update: 更新第013期內容
Docs: 補充 README 安裝說明
```

## 📚 新增期數流程

1. **複製最新期數的 HTML**
   ```bash
   cp issues/012.html issues/013.html
   ```

2. **更新內容**
   - 修改期數資訊
   - 更新文章內容
   - 檢查所有連結

3. **更新 scripts.js**
   - 更新 `latestIssueValue`
   - 在 `issuesData` 添加新期數

4. **更新 index.html**
   - 修改自動跳轉 URL

5. **更新搜尋索引**
   - 在 `search-index.json` 添加新內容

6. **測試**
   - 檢查所有功能是否正常
   - 測試響應式設計
   - 驗證搜尋功能

## 🧪 測試

提交前請確保：

- [ ] 所有 HTML 檔案可以正常開啟
- [ ] 響應式設計在各裝置正常顯示
- [ ] 搜尋功能正常運作
- [ ] 期數切換功能正常
- [ ] 快速導覽功能正常
- [ ] 所有外部連結可以正常開啟
- [ ] Google Analytics 追蹤正常

## 📞 需要協助？

如有任何問題，歡迎：

- 提交 [Issue](https://github.com/TVBS-AI/tvbs-ai-newsletter/issues)
- 聯繫 TVBS AI 未來科技部

## 📜 授權

貢獻到此專案的程式碼將遵循專案的授權條款。

---

再次感謝您的貢獻！ ❤️