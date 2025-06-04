const express = require("express");
const router = express.Router();
const {
  submitCompetitionHandler,
  getSubmissionsHandler,
  approveSubmissionHandler,
  voteSubmissionHandler
} = require("../controllers/competitionController");

// POST /api/competition/submit
router.post("/submit", submitCompetitionHandler);

// GET /api/competition/list?status=approved|pending|rejected
router.get("/list", getSubmissionsHandler);

// POST /api/competition/approve
router.post("/approve", approveSubmissionHandler);

// POST /api/competition/vote
router.post("/vote", voteSubmissionHandler);

module.exports = router;
