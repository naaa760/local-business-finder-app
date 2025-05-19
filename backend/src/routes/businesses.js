const express = require("express");
const router = express.Router();
const {
  getNearbyBusinesses,
  getBusinessById,
  createBusiness,
  getMyBusinesses,
} = require("../controllers/businessController");
const {
  getBusinessReviews,
  submitReview,
} = require("../controllers/reviewController");
const { protect, restrictTo } = require("../middleware/auth");

// Public routes
router.get("/nearby", getNearbyBusinesses);
router.get("/:id", getBusinessById);
router.get("/:businessId/reviews", getBusinessReviews);

// Protected routes
router.use(protect);

// Business owner routes
router.post("/", restrictTo("business_owner", "admin"), createBusiness);
router.get("/owner", getMyBusinesses);

// Review routes
router.post("/:businessId/reviews", submitReview);

module.exports = router;
