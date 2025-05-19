const express = require("express");
const router = express.Router();
const { getPlacesNearby } = require("../controllers/externalApiController");

router.get("/places", getPlacesNearby);

module.exports = router;
