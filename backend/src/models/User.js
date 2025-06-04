/**
 * 使用者模型：紀錄錢包地址、邀請碼、註冊時間
 */
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, unique: true, required: true, lowercase: true },
  inviterCode: { type: String, unique: true, sparse: true }, // 自己的邀請碼
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
