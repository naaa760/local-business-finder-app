const express = require("express");
const router = express.Router();
const {
  getPlacesNearby,
  getPlaceDetails,
} = require("../controllers/externalApiController");

router.get("/places", getPlacesNearby);
router.get("/places/:id", getPlaceDetails);

module.exports = router;
