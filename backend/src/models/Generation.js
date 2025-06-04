/**
 * Generation：紀錄每次 AI 生成請求及其狀態
 */
const mongoose = require("mongoose");

const GenerationSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, lowercase: true },
  prompt: { type: String, required: true },
  cid: { type: String, required: true },
  inviterCode: { type: String, default: null },
  minted: { type: Boolean, default: false },
  mintedAt: { type: Date, default: null },
  tokenId: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Generation", GenerationSchema);
