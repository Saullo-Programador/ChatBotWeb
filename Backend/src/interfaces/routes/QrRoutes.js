const express = require('express');
const whatsappController = require('../../app/controllers/WhatsappController');

const router = express.Router();

router.get('/', whatsappController.getQRCode);

module.exports = router;
