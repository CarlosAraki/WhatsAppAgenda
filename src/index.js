const express = require('express');
require('dotenv').config();
const glpiClass = require('./glpiClass');
const connectionClass = require('./connectionClass')
const fs = require('fs');
const path = require('path');
const docs = require('./botDocumentation.js');


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

const connectionObj = new connectionClass();

const glpiAppToken = process.env.APP_TOKEN;
const glpiBaseUrl = process.env.BASE_URL;
const url = process.env.BASE_URL_ONLY;
const glpiSessionToken = process.env.SESSION_TOKEN;
const glpi = new glpiClass(glpiBaseUrl, glpiAppToken,url,glpiSessionToken);

// Função para iniciar o Venom e ouvir as mensagens
async function start(client) {
    let lastProcessedMessageId = null;
    let useHelp = true
    client.onAnyMessage(async (message) => {
        if (message.id === lastProcessedMessageId) return;
        
        lastProcessedMessageId = message.id;

        //console.log(message)
        if (message.body === 'alerta_resumo') {
            await alerta_resumo(client,message)
        }
        if (/^[aA]lerta_classificacao/i.test(message.body)) {
            await alerta_classificacao(client,message)
        }
        if (/^[gG]lpi/i.test(message.body)) { 
            let params = message.body.split("-");
            switch (params[1]) {
                case 'initsession':
                  try {
                    sessionToken = await glpi.initSession(params[2], params[3]);
                    // salvar sessionToken em localStorage
                    client.sendText(message.from,  `Session: OK -- ${sessionToken}`);
                    break;
                  } catch (error) {
                    e = JSON.stringify((error))
                    console.log(e);
                    client.sendText(message.from, `Exception: ${e}`);
                    break;
                  }
                case 'checkall':
                  try {
                    // obter sessionToken do localStorage
                    await glpi.checkTicket(params[2],client,message);
                    break;
                  } catch (error) {
                    client.sendText(message.from, `Exception: ${error.message}`);
                    break;
                  }
                case 'check':
                try {
                    // obter sessionToken do localStorage
                    await glpi.checkTicket(params[2],client,message,false);
                    break;
                } catch (error) {
                    client.sendText(message.from, `Exception: ${error.message}`);
                    break;
                }
                case 'update':
                try {
                    // obter sessionToken do localStorage
                    await glpi.updateTicket(params,client,message);
                    break;
                } catch (error) {
                    client.sendText(message.from, `Exception: ${error.message}`);
                    break;
                }
                case 'create':
                try {
                    // obter sessionToken do localStorage
                    await glpi.createTicket(params,client,message);
                    break;
                } catch (error) {
                    client.sendText(message.from, `Exception: ${error.message}`);
                    break;
                }
                case 'subir':
                try {
                    // obter sessionToken do localStorage
                    await glpi.subirTicket(params,client,message);
                    break;
                } catch (error) {
                    client.sendText(message.from, `Exception: ${error.message}`);
                    break;
                }
                case 'descer':
                try {
                    // obter sessionToken do localStorage
                    await glpi.descerTicket(params,client,message);
                    break;
                } catch (error) {
                    client.sendText(message.from, `Exception: ${error.message}`);
                    break;
                }
                case 'avisoUrgencia':
                try {
                    // obter sessionToken do localStorage
                    await glpi.avisoUrgencia(params[2],client);
                    break;
                } catch (error) {
                    client.sendText(message.from, `Exception: ${error.message}`);
                    break;
                }
                case 'enviaBotao':
                try {
                    // obter sessionToken do localStorage
                    await glpi.botao(client);
                    break;
                } catch (error) {
                    client.sendText(message.from, `Exception: ${error.message}`);
                    break;
                }
                case 'ticketsAbertos':
                try {
                    // obter sessionToken do localStorage
                    await glpi.listUserTickets(params,client,message);
                    break;
                } catch (error) {
                    client.sendText(message.from, `Exception: ${error.message}`);
                    break;
                }
                case 'ticketsAbertosArea':
                try {
                    // obter sessionToken do localStorage
                    await glpi.listEntityTickets(params,client,message);
                    break;
                } catch (error) {
                    client.sendText(message.from, `Exception: ${error.message}`);
                    break;
                }
                default:
                  client.sendText(message.from,"Exception -- Error Commands");
                  break;
              }
        }
        if (/^[gG]lpi/i.test(message.caption)) { //para image
            console.log(message.caption)
            let params = message.caption.split("-");
            switch (params[1]) {
                case 'foto':
                    try {
                        let filenameBuffer = await retornaImagem(client, message);
                        await glpi.addImageFollowUpDirect(params, filenameBuffer, client, message);
                        break;
                    } catch (error) {
                        client.sendText(message.from, `Exception: ${error.message}`);
                        break;
                    }
                default:
                    break;
            }
        }
        if (/^[hH]elp/i.test(message.body)) {
            client.sendText(message.from,docs);
        }
    }
);
}



/**
 * Retorna a imagem quando envia pelo venon 
 * @param {*} client 
 * @param {*} message 
 */
async function retornaImagem(client, message) {
    try {
        // 1. Obter o buffer da imagem
        const buffer = await client.decryptFile(message);
        const base64 = buffer.toString('base64');
        console.log('Base64 da imagem (início):', base64.substring(0, 50) + '...');

        // 2. verificar diretório se não existir chmod777 
        const savePath = '/var/www/html/buffer';

        // 3. Gerar nome do arquivo com timestamp e random seed
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `img-${timestamp}.jpg`;
        const fullPath = path.join(savePath, filename);

        // 4. Salvar a imagem no servidor
        fs.writeFileSync(fullPath, buffer);
        console.log(`Imagem salva em: ${fullPath}`);

        return filename;
    } catch (error) {
        console.error('Erro ao processar imagem:', error);
        throw error; // Rejeita o erro para ser tratado no chamador
    }
}


/**
 * Funcao para Alerta de resumo de especialidade 
 */
async function alerta_resumo(client,message){
    const data = new Date().toISOString().split('T')[0]; // Formata a data no formato YYYY-MM-DD
    let param = message.body;
    const resultado = await connectionObj.runQuery(data,takeFile(param)); // Aguarda o resultado da consulta
    // Verifica se há algum resultado e envia a resposta no WhatsApp
    if (resultado && resultado.length > 0) {
        let resposta = '*Resumo de classificação de risco:*\n';
        resultado.forEach((row) => {
            resposta += ` *Especialidade*: ${row.nome_especialidade}, *Quantidade*: ${row.count}\n`;
        });
        // Envia o resumo por mensagem no WhatsApp
        client
            .sendText(message.from, resposta)
            .then((result) => {
                console.log('Mensagem enviada: ', result);
            })
            .catch((erro) => {
                console.error('Erro ao enviar a mensagem: ', erro);
            });
    } else {
        client.sendText(message.from, 'Nenhum dado encontrado.');
    }
}


async function alerta_classificacao(client,message) {
    let params = message.body;
    const parts = params.split(' ');
    const command = parts[0];
    let parameter = parts[1]; 
    if (!parameter) {
        client.sendText(message.from, 'Atenção: Nenhum parâmetro fornecido.');
        parameter = " '' "
    }
    const data = new Date().toISOString().split('T')[0]; // Formata a data no formato YYYY-MM-DD

    const resultado = await connectionObj.runQuery(data,takeFile(command)+parameter); // Aguarda o resultado da consulta


    if (resultado && resultado.length > 0) {
        let resposta = '*Alerta classificação de risco*:\n';
        resultado.forEach((row) => {
            resposta += ` *Queixa Principal*: ${parameter}, *Quantidade*: ${row.qnt}\n`;
        });
        // Envia o resumo por mensagem no WhatsApp
        client
            .sendText(message.from, resposta)
            .then((result) => {
                console.log('Mensagem enviada: ', result);
            })
            .catch((erro) => {
                console.error('Erro ao enviar a mensagem: ', erro);
            });
    } else {
        client.sendText(message.from, 'Nenhum dado encontrado.');
    }
}

/**
 * funcao responsável para trazer arquivo de forma sincrona
 */

function takeFile(content){
    let filePath = path.join(__dirname, "queries/"+content+".sql");
    return fs.readFileSync(filePath, 'utf8');
}




