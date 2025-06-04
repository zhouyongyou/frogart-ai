/**
 * 負責處理 /api/generate 請求：
 * 1. 驗證輸入
 * 2. 調用 AI 生成並上傳至 IPFS
 * 3. 記錄資料庫
 * 4. 返回 { cid, previewUrl }
 */

const path = require("path");
const fs = require("fs");
const { generateAIImage } = require("../utils/aiEngine");
const { uploadToIPFS } = require("../utils/ipfs");
const Generation = require("../models/Generation");
const User = require("../models/User");
const { ethers } = require("ethers");
const config = require("../config");

async function generateHandler(req, res) {
  try {
    const { prompt, walletAddress, inviterCode } = req.body;
    if (!prompt || !walletAddress) {
      return res.status(400).json({ error: "Missing prompt or walletAddress" });
    }

    // 如果是新使用者，註冊並分配邀請碼（隨機 8 字節字串）
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      const code = ethers.utils.hexlify(ethers.utils.randomBytes(4)); // 8 位 hex
      user = await User.create({ walletAddress: walletAddress.toLowerCase(), inviterCode: code });
      // 呼叫鏈上 InviterTracker 註冊邀請碼
      const { inviterContract } = require("../utils/eth");
      await inviterContract.registerInviter(code, walletAddress);
    }

    // 如果傳入 inviterCode，檢測其合法性、記錄邀請（後端暫不重複寫入鏈上，留在分享驗證階段）
    let usedCode = null;
    if (inviterCode) {
      const inviterAddr = await require("../utils/eth").inviterContract.inviter(inviterCode);
      if (inviterAddr && inviterAddr !== ethers.constants.AddressZero) {
        usedCode = inviterCode;
      }
    }

    // 呼叫 AI 生成
    const fileName = `frog_${Date.now()}.png`;
    const localPath = await generateAIImage(prompt, fileName);

    // 上傳至 IPFS
    const cid = await uploadToIPFS(localPath, fileName);

    // 刪除本地臨時檔
    fs.unlinkSync(localPath);

    // 入庫
    const generation = await Generation.create({
      walletAddress: walletAddress.toLowerCase(),
      prompt,
      cid,
      inviterCode: usedCode,
      minted: false
    });

    return res.json({ cid, previewUrl: `https://ipfs.io/ipfs/${cid}` });
  } catch (err) {
    console.error("generateHandler error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { generateHandler };
