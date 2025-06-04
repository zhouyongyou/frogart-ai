const express = require("express");
const router = express.Router();
const { generateHandler } = require("../controllers/generateController");

// POST /api/generate
router.post("/", generateHandler);

module.exports = router;
