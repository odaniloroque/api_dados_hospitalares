const express = require('express');
const router = express.Router();

router.get('/manutencao', function(req, res) {
  // res.send('Desculpe, este site está em construção ou manutenção no momento. Por favor, tente novamente mais tarde.');
  res.send(`
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Em manutenção</title>
    <style>
      body {
        background-color: #f2f2f2;
        font-family: Arial, sans-serif;
        text-align: center;
      }
      h1 {
        color: #333;
        font-size: 40px;

      }
      p {
        color: #666;
        font-size: 24px;
      }
      img {
        max-width: 80%;
        height: auto;
      }
    </style>
  </head>
  <body>
    <img src="https://images01.nicepage.io/c461c07a441a5d220e8feb1a/b61c86b16b7a5d95b057c8d9/60031-Converted.png" alt="Imagem de manutenção">
    <h1>Estamos em manutenção!</h1>
    <p>Desculpe-nos pelo transtorno. Estamos trabalhando para melhorar nosso site.</p>
  </body>
  </html>
  `)
});

module.exports = router;