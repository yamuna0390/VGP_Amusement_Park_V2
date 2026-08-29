const express = require('express');
const router = express.Router();
const operatorEnquiryController = require('../controllers/operatorEnquiryController');

router.post('/', operatorEnquiryController.createOperatorEnquiry);

module.exports = router;
