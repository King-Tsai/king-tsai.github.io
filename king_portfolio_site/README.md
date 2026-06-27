# KING TSAI 個人網站（靜態版）

這是一個依履歷內容整理而成的靜態個人網站，定位為「資訊管理、資訊安全、AI 應用整合」專業形象頁。

## 檔案說明

- `index.html`：前台個人網站
- `assets/css/styles.css`：網站樣式
- `assets/js/data.js`：網站內容資料。未來只要修改這個檔案，即可更新網站文字、經歷、技能、證照、專案與聯絡 Email。
- `assets/js/main.js`：前台渲染邏輯，負責讀取 `data.js` 並產生頁面內容。

## 使用方式

1. 直接開啟 `index.html` 可查看網站。
2. 修改 `assets/js/data.js` 內的 `window.DEFAULT_PORTFOLIO_DATA` 即可調整網站內容。
3. 修改聯絡 Email：請編輯 `assets/js/data.js` 內的 `contact.email`。
4. 修改完成後，重新整理瀏覽器即可看到新內容。

## 本版調整

- 已移除原本的 `admin.html` 後台管理頁。
- 已移除 `assets/js/admin.js`。
- 前台不再讀取 `localStorage`，只讀取 `assets/js/data.js`。
- 原本「後台編輯」入口已改為「E-mail 聯絡」。

## 個資處理

公開頁面僅保留聯絡 Email，其餘已移除或不公開：

- 手機號碼
- 詳細地址
- 年齡
- 生日
- 身分證字號
- 薪資
- 個人照片
- 可識別之敏感附件圖片

## 部署建議

此網站是純靜態架構，適合部署於 GitHub Pages、Netlify、Cloudflare Pages 或一般網站空間。若日後需要正式後台、多人共同維護或權限控管，建議再改成 Headless CMS 或後端資料庫架構。
