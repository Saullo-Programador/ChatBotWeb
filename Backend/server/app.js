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

// Função auxiliar para carregar perguntas
const getQuestions = () => {
  if (!fs.existsSync(QUESTIONS_FILE)) {
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
  } catch {
    return [];
  }
};

// Função auxiliar para salvar perguntas
const saveQuestions = (questions) => {
  fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
};

// Rota para obter perguntas
app.get('/questions', (req, res) => {
  try {
    const questions = getQuestions();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao ler perguntas.' });
  }
});

// Rota para adicionar perguntas com subperguntas
app.post('/questions', (req, res) => {
  const { question, options } = req.body;
  if (!question || !options || !Array.isArray(options)) {
    return res.status(400).json({ message: 'Dados inválidos.' });
  }
  try {
    const questions = getQuestions();
    const newQuestion = {
      id: questions.length + 1,
      question,
      options: options.map((option) => ({
        text: option.text,
        nextQuestionId: option.nextQuestionId || null,
        subQuestions: option.subQuestions || [],
      })),
    };
    questions.push(newQuestion);
    saveQuestions(questions);
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar pergunta.' });
  }
});

// Rota para deletar perguntas
app.delete('/questions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const questions = getQuestions();
    const filteredQuestions = questions.filter((q) => q.id !== id);
    saveQuestions(filteredQuestions);
    res.json({ message: 'Pergunta removida com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar pergunta.' });
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
  const name = contact.pushname || 'cliente';

  if (!global.clientStates) global.clientStates = {};
  const clientState = global.clientStates;

  if (!clientState[msg.from]) {
    clientState[msg.from] = { step: 0, awaitingResponse: true };
    await client.sendMessage(
      msg.from,
      `Olá, ${name}! Vamos começar seu atendimento? Responda "sim" para iniciar.`
    );
    return;
  }

  const state = clientState[msg.from];
  const questions = getQuestions();

  if (state.awaitingResponse) {
    if (msg.body.trim().toLowerCase() === 'sim') {
      state.awaitingResponse = false;

      if (questions.length > 0) {
        const { question, options } = questions[0];
        await client.sendMessage(
          msg.from,
          `Ótimo! Vamos começar.\n\n${question}\n\n${options
            .map((o, i) => `${i + 1}. ${o.text}`)
            .join('\n')}`
        );
        state.step = 0;
        state.path = [0];
      } else {
        await client.sendMessage(
          msg.from,
          'Nenhuma pergunta configurada. Entre em contato com o suporte.'
        );
        delete clientState[msg.from];
      }
    } else {
      await client.sendMessage(msg.from, 'Por favor, responda "sim" para iniciar o atendimento.');
    }
    return;
  }

  const currentQuestion = questions[state.path[state.step]];
  const selectedOptionIndex = parseInt(msg.body.trim()) - 1;
  const selectedOption = currentQuestion.options[selectedOptionIndex];

  if (selectedOption) {
    if (selectedOption.subQuestions && selectedOption.subQuestions.length > 0) {
      const subQuestion = selectedOption.subQuestions[0];
      await client.sendMessage(msg.from, `${subQuestion.question}`);
    } else if (selectedOption.nextQuestionId != null) {
      const nextQuestion = questions.find((q) => q.id === selectedOption.nextQuestionId);
      if (nextQuestion) {
        await client.sendMessage(
          msg.from,
          `${nextQuestion.question}\n\n${nextQuestion.options
            .map((o, i) => `${i + 1}. ${o.text}`)
            .join('\n')}`
        );
        state.step++;
        state.path.push(nextQuestion.id);
      } else {
        await client.sendMessage(msg.from, 'Erro ao encontrar a próxima pergunta.');
      }
    } else {
      await client.sendMessage(msg.from, 'Obrigado! Finalizamos seu atendimento.');
      delete clientState[msg.from];
    }
  } else {
    await client.sendMessage(msg.from, 'Opção inválida. Por favor, tente novamente.');
  }
});

// Rota para obter o QR code
app.get('/qr', (req, res) => {
  if (global.qrCode) {
    res.json({ qrCode: global.qrCode });
  } else {
    res.status(404).json({ message: 'QR code ainda não gerado. Aguarde.' });
  }
});

// Inicializar cliente e servidor
(async () => {
  client.initialize();
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
})();
