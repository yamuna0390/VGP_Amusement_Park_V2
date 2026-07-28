const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offerController");
const authMiddleware = require("../middleware/authMiddleware");

// Offers CRUD
router.get("/", offerController.getOffers);
router.post("/", authMiddleware, offerController.createOffer);
router.put("/:id", authMiddleware, offerController.updateOffer);
router.delete("/:id", authMiddleware, offerController.deleteOffer);

module.exports = router;
