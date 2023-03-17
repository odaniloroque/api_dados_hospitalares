const express = require('express');
// const mssql = require('mssql');
const { Client } = require('mssql');
require('dotenv').config();

app.use(express.json());
app.use(morgan('tiny'));

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port:  parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: false, // Se você estiver usando o Azure
    trustServerCertificate: true // Altere esta opção se estiver usando SSL
  }
};



async function connectToDB() {
  const client = new Client({
    user: 'seu_usuario',
    host: 'seu_host',
    database: 'seu_banco_de_dados',
    password: 'sua_senha',
    port: 5432, // porta padrão do PostgreSQL
  });

  try {
    await client.connect();
    console.log('Conexão bem-sucedida!');
    return client;
  } catch (err) {
    console.error('Erro ao se conectar ao banco de dados', err.stack);
  }
}