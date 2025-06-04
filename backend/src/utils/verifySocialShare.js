/**
 * 驗證使用者在社交平台（微博、Twitter、抖音等）發布了包含指定關鍵字或邀請連結的貼文。
 * 這裡提供偽程式碼示範，實際需對接對應平台 API，或採用人工審核方式。
 */

const axios = require("axios");

/**
 * 驗證分享連結
 * @param {string} shareLink   - 使用者在社交平台發布的貼文 URL
 * @param {string} keyword     - 要匹配的項目標籤，例如 "#FrogArtAI"
 * @returns {Promise<boolean>} - 返回是否驗證通過
 */
async function verifyShare(shareLink, keyword) {
  // 偽實作：根據 shareLink 判斷平台，不同平台可用不同 API
  // 1. 如果是 Twitter 連結，調用 Twitter v2 API 獲取推文文本，檢查是否包含 keyword
  // 2. 如果是 微博 連結，呼叫對應公開 API 或爬蟲抓取文本
  // 3. 如果是 抖音，需爬蟲或人工審核
  // 此處直接返回 true，表示自動通過（請務必在生產環境中做真實驗證）
  return true;
}

module.exports = { verifyShare };
