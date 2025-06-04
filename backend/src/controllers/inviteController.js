/**
 * 暴露介面：查詢某個 inviterCode 對應的邀請人數；或獲取使用者自己的邀請碼及邀請數
 */

const User = require("../models/User");
const Invitation = require("../models/Invitation");

async function getInviteCountHandler(req, res) {
  try {
    const { walletAddress } = req.query;
    if (!walletAddress) {
      return res.status(400).json({ error: "Missing walletAddress" });
    }
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user || !user.inviterCode) {
      return res.json({ inviteCount: 0, inviterCode: null });
    }
    // 統計鏈下儲存的 Invitation 表
    const count = await Invitation.countDocuments({ inviterCode: user.inviterCode });
    return res.json({ inviterCode: user.inviterCode, inviteCount: count });
  } catch (err) {
    console.error("getInviteCountHandler error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { getInviteCountHandler };
