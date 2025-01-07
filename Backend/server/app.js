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

// Inicializar ou carregar perguntas
if (!fs.existsSync(QUESTIONS_FILE)) {
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify([]));
}

// Rota para obter perguntas
app.get("/questions", (req, res) => {
    try {
      const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE));
      res.json(questions);
    } catch (err) {
      res.status(500).json({ message: "Erro ao ler perguntas." });
    }
  });
  
  // Rota para adicionar perguntas
  app.post("/questions", (req, res) => {
    const { question, options } = req.body;
    if (!question || !options || !Array.isArray(options)) {
      return res.status(400).json({ message: "Dados inválidos." });
    }
    try {
      const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE));
      questions.push({ question, options });
      fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
      res.status(201).json({ message: "Pergunta salva com sucesso." });
    } catch (err) {
      res.status(500).json({ message: "Erro ao salvar pergunta." });
    }
  });
  
  // Rota para deletar uma pergunta
  app.delete("/questions/:index", (req, res) => {
    const index = parseInt(req.params.index);
    try {
      const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE));
      if (index >= 0 && index < questions.length) {
        questions.splice(index, 1);
        fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
        res.json({ message: "Pergunta removida com sucesso." });
      } else {
        res.status(400).json({ message: "Índice inválido." });
      }
    } catch (err) {
      res.status(500).json({ message: "Erro ao deletar pergunta." });
    }
  });

// Integração com o WhatsApp
client.on('qr', (qr) => {
    console.log('QR RECEBIDO:', qr);
    QRCode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Erro ao gerar QR code:', err);
            return;
        }
        global.qrCode = url;
    });
});

client.on('ready', () => {
    console.log('WhatsApp está pronto!');
});

client.on('message', async (msg) => {
    const contact = await msg.getContact();
    const name = contact.pushname || "cliente";

    // Estado dos clientes
    if (!global.clientStates) global.clientStates = {};
    const clientState = global.clientStates;

    if (!clientState[msg.from]) {
        clientState[msg.from] = { step: 0, awaitingResponse: true };
        await client.sendMessage(
            msg.from,
            `Olá, ${name}! Estou aqui para ajudá-lo. Vamos começar seu atendimento? Responda "sim" para iniciar.`
        );
        return;
    }

    const state = clientState[msg.from];

    if (state.awaitingResponse) {
        if (msg.body.trim().toLowerCase() === "sim") {
            state.awaitingResponse = false;

            const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
            if (questions.length > 0) {
                const { question, options } = questions[0];
                await client.sendMessage(
                    msg.from,
                    `Ótimo! Vamos começar.\n\n${question}\n\n${options
                        .map((o, i) => `${i + 1}. ${o}`)
                        .join('\n')}`
                );
                state.step = 1;
            } else {
                await client.sendMessage(
                    msg.from,
                    "Nenhuma pergunta configurada. Por favor, entre em contato com o suporte."
                );
                delete clientState[msg.from];
            }
        } else {
            await client.sendMessage(msg.from, 'Por favor, responda "sim" para iniciar o atendimento.');
        }
        return;
    }

    // Enviar próximas perguntas
    const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
    if (state.step > 0 && state.step <= questions.length) {
        const { question, options } = questions[state.step];
        await client.sendMessage(
            msg.from,
            `${question}\n\n${options.map((o, i) => `${i + 1}. ${o}`).join('\n')}`
        );
        state.step++;
    } else if (state.step > questions.length) {
        await client.sendMessage(msg.from, "Obrigado! Atendimento concluído.");
        delete clientState[msg.from];
    }
});

// QR code para conexão
app.get('/qr', (req, res) => {
    if (global.qrCode) {
        res.json({ qrCode: global.qrCode });
    } else {
        res.status(404).json({ message: 'QR code ainda não gerado. Aguarde.' });
    }
});

// Inicializar cliente e servidor
client.initialize();
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
