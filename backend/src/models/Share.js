/**
 * Share：紀錄使用者每次分享操作及驗證狀態
 */
const mongoose = require("mongoose");

const ShareSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, lowercase: true },
  socialPlatform: { type: String, required: true },
  shareLink: { type: String, required: true },
  verified: { type: Boolean, default: false },
  rewardType: { type: String, enum: ["freeMint", "rareNFT", "token"], default: null },
  rewardTxHash: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date, default: null }
});

module.exports = mongoose.model("Share", ShareSchema);
