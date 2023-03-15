const express = require('express');
const mssql = require('mssql');
const morgan = require('morgan');

const app = express();

require('dotenv').config();


app.use(express.json());
app.use(morgan('tiny'));

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Se você estiver usando o Azure
    trustServerCertificate: true // Altere esta opção se estiver usando SSL
  }
};

const pool = new mssql.ConnectionPool(config);

pool.connect(err => {
  if (err) {
    console.error(err);
  } else {
    console.log('Conectado ao MSSQL');
  }
});

app.get('/', (req, res) => {
  pool.request().query('SELECT * FROM paciente', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao buscar dados');
    } else {
      res.send(result.recordset);
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
