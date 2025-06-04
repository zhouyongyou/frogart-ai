const express = require("express");
const router = express.Router();
const { getRankingHandler } = require("../controllers/rankingController");

// GET /api/ranking?type=invite|share|creative&period=daily|weekly|monthly
router.get("/", getRankingHandler);

module.exports = router;
