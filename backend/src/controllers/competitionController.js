/**
 * 創意挑戰賽相關：提交參賽作品、查詢列表、投票、管理員審批
 */

const CompetitionSubmission = require("../models/CompetitionSubmission");
const { aiArtContract } = require("../utils/eth");

// 提交參賽作品
async function submitCompetitionHandler(req, res) {
  try {
    const { walletAddress, cid, description, socialLink } = req.body;
    if (!walletAddress || !cid) {
      return res.status(400).json({ error: "Missing walletAddress or cid" });
    }
    const existing = await CompetitionSubmission.findOne({
      walletAddress: walletAddress.toLowerCase(),
      cid
    });
    if (existing) {
      return res.status(400).json({ error: "Already submitted this work" });
    }
    await CompetitionSubmission.create({
      walletAddress: walletAddress.toLowerCase(),
      cid,
      description,
      socialLink
    });
    return res.json({ success: true });
  } catch (err) {
    console.error("submitCompetitionHandler error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// 查詢參賽作品列表
async function getSubmissionsHandler(req, res) {
  try {
    const { status } = req.query; // pending / approved / rejected
    const filter = status ? { status } : {};
    const subs = await CompetitionSubmission.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ submissions: subs });
  } catch (err) {
    console.error("getSubmissionsHandler error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// 管理員審批
async function approveSubmissionHandler(req, res) {
  try {
    const { submissionId, action } = req.body; // action: "approve" 或 "reject"
    if (!submissionId || !["approve", "reject"].includes(action)) {
      return res.status(400).json({ error: "Missing or invalid parameters" });
    }
    const sub = await CompetitionSubmission.findById(submissionId);
    if (!sub) {
      return res.status(404).json({ error: "Submission not found" });
    }
    sub.status = action === "approve" ? "approved" : "rejected";
    await sub.save();
    return res.json({ success: true });
  } catch (err) {
    console.error("approveSubmissionHandler error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// 社區使用者投票
async function voteSubmissionHandler(req, res) {
  try {
    const { walletAddress, submissionId } = req.body;
    // 簡化：每人每天只能投一次，需前端自行限制，也可後端加邏輯
    const sub = await CompetitionSubmission.findById(submissionId);
    if (!sub || sub.status !== "approved") {
      return res.status(400).json({ error: "Invalid submission or not approved" });
    }
    sub.voteCount += 1;
    await sub.save();
    return res.json({ success: true });
  } catch (err) {
    console.error("voteSubmissionHandler error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  submitCompetitionHandler,
  getSubmissionsHandler,
  approveSubmissionHandler,
  voteSubmissionHandler
};
