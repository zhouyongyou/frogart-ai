const express = require("express");
const router = express.Router();
const { shareHandler } = require("../controllers/shareController");

// POST /api/verifyShare
router.post("/", shareHandler);

module.exports = router;
