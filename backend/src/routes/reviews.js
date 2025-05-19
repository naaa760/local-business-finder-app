const express = require("express");
const router = express.Router();
const { getMyReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/my-reviews", getMyReviews);

module.exports = router;
