const qrService = require('../../infra/QrService');

module.exports = {
  getQRCode: (req, res) => {
    const qrCode = qrService.getQRCode();
    if (qrCode) {
      res.json({ qrCode });
    } else {
      res.status(404).json({ message: 'QR code ainda não gerado. Aguarde.' });
    }
  },
};
