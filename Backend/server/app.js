const express = require('express');
const fs = require('fs');
const path = require('path');
const { Client } = require('whatsapp-web.js');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
const PORT = 3000;
const client = new Client();
const QUESTIONS_FILE = path.join(__dirname, 'questions.json');

// Middleware
app.use(cors());
app.use(express.json());

// Carregar ou inicializar as perguntas
if (!fs.existsSync(QUESTIONS_FILE)) {
    try {
        fs.writeFileSync(QUESTIONS_FILE, JSON.stringify([]));
    } catch (err) {
        console.error('Erro ao inicializar o arquivo de perguntas:', err);
    }
}

// Rotas da API
app.get('/questions', (req, res) => {
    try {
        const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE));
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao ler o arquivo de perguntas' });
    }
});

app.post('/questions', (req, res) => {
    const { question, options } = req.body;
    try {
        const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE));
        questions.push({ question, options });
        fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
        res.status(201).json({ message: 'Pergunta adicionada com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao escrever no arquivo de perguntas' });
    }
});

app.delete('/questions/:index', (req, res) => {
    const index = parseInt(req.params.index);
    try {
        const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE));
        if (index >= 0 && index < questions.length) {
            questions.splice(index, 1);
            fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
            res.json({ message: 'Pergunta deletada com sucesso' });
        } else {
            res.status(400).json({ message: 'Índice inválido' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erro ao ler ou escrever o arquivo de perguntas' });
    }
});

// Integração com o WhatsApp
client.on('qr', (qr) => {
    console.log('QR RECEBIDO:', qr);
    if (!qrCodeData) {
        // Gerar o QR code em formato base64
        QRCode.toDataURL(qr, (err, url) => {
            if (err) {
                console.error('Erro ao gerar o QR code:', err);
                return;
            }
            qrCodeData = url; // Armazena o QR code para o frontend
        });
    }
});

client.on('ready', () => {
    console.log('WhatsApp Web está pronto!');
});

client.on('message', async (msg) => {
    try {
        const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE));
        const contact = await msg.getContact();
        const name = contact.pushname ? contact.pushname.split(" ")[0] : "cliente";

        // Enviar uma mensagem inicial personalizada
        await client.sendMessage(
            msg.from,
            `Olá, ${name}! Estou aqui para ajudá-lo. Vamos começar!`
        );

        // Enviar as perguntas e opções
        for (const { question, options } of questions) {
            await client.sendMessage(msg.from, `${question}\n\n${options.map((o, i) => `${i + 1}. ${o}`).join('\n')}`);
        }
    } catch (err) {
        console.error('Erro ao processar a mensagem:', err);
    }
});

client.initialize();

// Servir o QR code
let qrCodeData = null;
app.get('/qr', (req, res) => {
    if (qrCodeData) {
        res.json({ qrCode: qrCodeData });
    } else {
        res.status(404).json({ message: 'QR code ainda não gerado. Aguarde.' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor está rodando em http://localhost:${PORT}`);
});
