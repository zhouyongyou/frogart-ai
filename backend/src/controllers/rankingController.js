/**
 * 查詢排行榜：
 * - /api/ranking?type=invite|share|creative&period=daily|weekly|monthly
 * 返回 Top 10 排行資料
 */

const Invitation = require("../models/Invitation");
const Share = require("../models/Share");
const CompetitionSubmission = require("../models/CompetitionSubmission");

async function getRankingHandler(req, res) {
  try {
    const { type, period } = req.query;
    if (!type || !period) {
      return res.status(400).json({ error: "Missing type or period" });
    }

    let periodStart = new Date();
    switch (period) {
      case "daily":
        periodStart.setHours(0, 0, 0, 0);
        break;
      case "weekly":
        const dayOfWeek = periodStart.getDay();
        periodStart.setDate(periodStart.getDate() - dayOfWeek);
        periodStart.setHours(0, 0, 0, 0);
        break;
      case "monthly":
        periodStart.setDate(1);
        periodStart.setHours(0, 0, 0, 0);
        break;
      default:
        return res.status(400).json({ error: "Invalid period" });
    }

    if (type === "invite") {
      // 統計 Invitation 表
      const agg = await Invitation.aggregate([
        { $match: { createdAt: { $gte: periodStart } } },
        { $group: { _id: "$inviterCode", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      return res.json({ ranking: agg });
    } else if (type === "share") {
      // 統計 Share 表
      const agg = await Share.aggregate([
        { $match: { verified: true, verifiedAt: { $gte: periodStart } } },
        { $group: { _id: "$walletAddress", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
      return res.json({ ranking: agg });
    } else if (type === "creative") {
      // 按 voteCount 排序，前 10
      const subs = await CompetitionSubmission.find({
        status: "approved",
        createdAt: { $gte: periodStart }
      })
        .sort({ voteCount: -1 })
        .limit(10)
        .lean();
      return res.json({ ranking: subs });
    } else {
      return res.status(400).json({ error: "Invalid ranking type" });
    }
  } catch (err) {
    console.error("getRankingHandler error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { getRankingHandler };
