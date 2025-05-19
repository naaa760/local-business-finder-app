const express = require("express");
const router = express.Router();
const {
  getFavorites,
  toggleFavorite,
  checkIsFavorite,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/favorites", getFavorites);
router.post("/favorites/:businessId", toggleFavorite);
router.get("/favorites/check/:businessId", checkIsFavorite);

module.exports = router;
