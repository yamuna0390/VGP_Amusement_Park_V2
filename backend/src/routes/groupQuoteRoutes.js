const express = require('express');
const router = express.Router();
const groupQuoteController = require('../controllers/groupQuoteController');
const validate = require('../middleware/validationMiddleware');
const { groupQuoteSchema } = require('../validations/groupQuoteValidation');

router.post('/', validate(groupQuoteSchema), groupQuoteController.createGroupQuote);

module.exports = router;
