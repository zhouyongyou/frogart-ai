const express = require("express");
const router = express.Router();
const { getInviteCountHandler } = require("../controllers/inviteController");

// GET /api/invite?walletAddress=0x...
router.get("/", getInviteCountHandler);

module.exports = router;
