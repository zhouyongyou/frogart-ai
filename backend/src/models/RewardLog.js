/**
 * RewardLog：紀錄每次鏈上/鏈下獎勵發放情況
 */
const mongoose = require("mongoose");

const RewardLogSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, lowercase: true },
  rewardType: {
    type: String,
    enum: ["inviteReward", "shareReward", "competitionReward", "tokenReward"],
    required: true
  },
  amount: { type: Number, default: 0 }, // 若是代幣獎勵則用數值；若是 NFT 可寫 tokenId
  txHash: { type: String, default: null }, // 鏈上交易哈希
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RewardLog", RewardLogSchema);
