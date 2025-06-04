/**
 * Invitation：鏈下記錄每一個有效邀請
 */
const mongoose = require("mongoose");

const InvitationSchema = new mongoose.Schema({
  inviterCode: { type: String, required: true },
  inviteeAddress: { type: String, required: true, lowercase: true },
  createdAt: { type: Date, default: Date.now }
});

// 確保同一邀請人和被邀請人記錄唯一
InvitationSchema.index({ inviterCode: 1, inviteeAddress: 1 }, { unique: true });

module.exports = mongoose.model("Invitation", InvitationSchema);
