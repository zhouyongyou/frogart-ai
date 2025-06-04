/**
 * 負責處理 /api/verifyShare 請求：
 * 1. 驗證使用者簽名身份
 * 2. 呼叫 verifySocialShare 檢查分享是否真實
 * 3. 判斷獎勵類型（freeMint / rareNFT / token）
 * 4. 鏈上鑄造獎勵（若 freeMint 或 rareNFT），記錄 txHash
 * 5. 鏈下記錄到 RewardLog，返回結果
 */

const { verifyShare } = require("../utils/verifySocialShare");
const Generation = require("../models/Generation");
const Share = require("../models/Share");
const Invitation = require("../models/Invitation");
const RewardLog = require("../models/RewardLog");
const User = require("../models/User");
const { aiArtContract, inviterContract } = require("../utils/eth");
const { ethers } = require("ethers");

async function shareHandler(req, res) {
  try {
    const { walletAddress, shareLink, socialPlatform, inviterCode, signature, message } = req.body;
    if (!walletAddress || !shareLink || !socialPlatform || !signature || !message) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    // 驗證簽名：確保請求是持有該 walletAddress 的人發起
    const recovered = ethers.utils.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: "Signature verification failed" });
    }

    // 檢查是否已經在當天或之前做過分享，並已領取獎勵
    const existing = await Share.findOne({
      walletAddress: walletAddress.toLowerCase(),
      shareLink,
      verified: true
    });
    if (existing) {
      return res.status(400).json({ error: "Already rewarded for this share" });
    }

    // 呼叫社交平台驗證
    const isValid = await verifyShare(shareLink, "#FrogArtAI");
    if (!isValid) {
      // 記錄到資料庫但標記為未通過
      await Share.create({
        walletAddress: walletAddress.toLowerCase(),
        shareLink,
        socialPlatform,
        verified: false
      });
      return res.status(400).json({ error: "Share verification failed" });
    }

    // 分享驗證通過，判斷獎勵策略
    // 統計當天已 verified 的記錄數
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const verifiedCount = await Share.countDocuments({
      verified: true,
      createdAt: { $gte: todayStart }
    });

    let rewardType = "freeMint";
    if (verifiedCount < 100) {
      rewardType = "rareNFT"; // 前 100 名：稀有版 NFT
    }

    // 查詢使用者最近一次生成記錄，拿到 cid
    const genRecord = await Generation.findOne({
      walletAddress: walletAddress.toLowerCase(),
      minted: false
    }).sort({ createdAt: -1 });

    if (!genRecord) {
      return res.status(400).json({ error: "No available generation to mint" });
    }

    // 鏈上執行獎勵鑄造
    let tx;
    if (rewardType === "freeMint") {
      // 普通免費鑄造：使用者直接呼叫前端 mint；後端返還 mintFee（此處忽略，假設前端未支付 mintFee）
      tx = await aiArtContract.mintAIArt(genRecord.cid, { value: 0 });
    } else {
      // 稀有 NFT，由合約 owner 鑄造
      const rareCID = genRecord.cid; // 可由前端或後端指定專用稀有系列 CID
      tx = await aiArtContract.mintRareAIArt(walletAddress, rareCID);
    }
    const receipt = await tx.wait();

    // 更新 Generation 為已 minted，並記錄 tokenId
    const tokenId = receipt.events.find((e) => e.event === "Minted").args.tokenId.toNumber();
    genRecord.minted = true;
    genRecord.mintedAt = new Date();
    genRecord.tokenId = tokenId;
    await genRecord.save();

    // 如果使用者傳了 inviterCode，則鏈上記錄邀請關係，並鏈下存儲
    if (inviterCode) {
      await inviterContract.recordInvitation(walletAddress, inviterCode);
      await Invitation.create({
        inviterCode,
        inviteeAddress: walletAddress.toLowerCase()
      });
      // 記錄邀請獎勵到 RewardLog（後續 CRON 分發）
      await RewardLog.create({
        walletAddress: (await inviterContract.inviter(inviterCode)).toLowerCase(),
        rewardType: "inviteReward",
        amount: 0, // 實際分銷在 CRON job 中發放
        txHash: null
      });
    }

    // 記錄分享獎勵到資料庫
    await Share.create({
      walletAddress: walletAddress.toLowerCase(),
      socialPlatform,
      shareLink,
      verified: true,
      rewardType,
      rewardTxHash: receipt.transactionHash,
      verifiedAt: new Date()
    });

    // 記錄獎勵日誌
    await RewardLog.create({
      walletAddress: walletAddress.toLowerCase(),
      rewardType: "shareReward",
      amount: rewardType === "rareNFT" ? 1 : 0, // 稀有 NFT 為 1 件，freeMint 為 0
      txHash: receipt.transactionHash
    });

    return res.json({
      success: true,
      rewardType,
      txHash: receipt.transactionHash,
      tokenId
    });
  } catch (err) {
    console.error("shareHandler error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { shareHandler };
