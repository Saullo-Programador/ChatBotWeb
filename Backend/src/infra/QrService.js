const QRCode = require('qrcode');

let qrCode = null;

module.exports = {
  saveQRCode: (qr) => {
    QRCode.toDataURL(qr, (err, url) => {
      if (!err) qrCode = url;
    });
  },
  getQRCode: () => qrCode,
};
