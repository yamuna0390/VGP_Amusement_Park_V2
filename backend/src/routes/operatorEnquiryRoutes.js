const express = require('express');
const router = express.Router();
const operatorEnquiryController = require('../controllers/operatorEnquiryController');
const validate = require('../middleware/validationMiddleware');
const { operatorEnquirySchema } = require('../validations/operatorEnquiryValidation');

router.post('/', validate(operatorEnquirySchema), operatorEnquiryController.createOperatorEnquiry);

module.exports = router;
