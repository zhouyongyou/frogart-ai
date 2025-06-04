/**
 * CompetitionSubmission：創意挑戰賽參賽作品
 */
const mongoose = require("mongoose");

const CompetitionSubmissionSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, lowercase: true },
  cid: { type: String, required: true },
  description: { type: String, default: "" },
  socialLink: { type: String, default: "" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  voteCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CompetitionSubmission", CompetitionSubmissionSchema);
