const express = require('express');
const router = express.Router();
const groupQuoteController = require('../controllers/groupQuoteController');

router.post('/', groupQuoteController.createGroupQuote);

module.exports = router;
