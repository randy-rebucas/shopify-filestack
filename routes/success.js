const express = require('express');
const router = express.Router();

const SuccessController = require('../controllers/success');
/* GET success page. */
router.get('/', SuccessController.getSuccess);

module.exports = router;