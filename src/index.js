const express = require('express');
require('dotenv').config();


// Cria o servidor Express
const api = express();
const API_PORT = 4001;


// Rota simples para verificar se a aplicação está no ar
api.get('/status', (req, res) => {
    res.json({ status: 'Aplicação está no ar' });
});

// Inicia o servidor da API
api.listen(API_PORT, () => {
    console.log(`API de status rodando na porta ${API_PORT}`);
});



const {
  LocalStorage
} = require("node-localstorage")
var localStorage = new LocalStorage('./scratch');
var sessionToken = '';
localStorage.setItem('session', sessionToken)

// Iniciando a sessão do Venom
const venom = require('venom-bot');

venom
  .create({
    session: 'bot',
    multidevice: true,
    headless: true,  // Mude para true em produção
    useChrome: false,  // Use Chromium em vez do Chrome
    browserArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--single-process'
    ],
    puppeteerOptions: {
      executablePath: process.env.CHROME_BIN || '/usr/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    }
  })
  .then((client) => {
    console.log('Sessão iniciada com sucesso');
    start(client);
  })
  .catch((erro) => {
    console.error('Erro ao iniciar sessão:', erro);
  });
