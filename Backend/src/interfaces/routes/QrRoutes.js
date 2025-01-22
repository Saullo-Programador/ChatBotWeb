const express = require('express');
const whatsappController = require('../../app/controllers/whatsappController');

const router = express.Router();

router.get('/', whatsappController.getQRCode);

module.exports = router;
