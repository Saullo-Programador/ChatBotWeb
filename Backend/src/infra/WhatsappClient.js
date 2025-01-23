const { Client } = require('whatsapp-web.js');
const qrService = require('./QrService');

const client = new Client();

client.on('qr', (qr) => {
  qrService.saveQRCode(qr);
  console.log('WhatsApp qr code gerado!');
});

client.on('ready', () => {
  console.log('WhatsApp está pronto!');
});

module.exports = client;
