const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offerController");
const authMiddleware = require("../middleware/authMiddleware");

// Public Offers
router.get("/public/all", offerController.getPublicOffers);
router.get("/public/:id/nearest-date", offerController.getNearestValidDate);
// Offer Types
router.get("/types", offerController.getOfferTypes);
// Offers CRUD
router.get("/", offerController.getOffers);
router.post("/", authMiddleware, offerController.createOffer);
router.put("/:id", authMiddleware, offerController.updateOffer);
router.delete("/:id", authMiddleware, offerController.deleteOffer);

module.exports = router;
