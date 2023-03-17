const express = require('express');
const router = express.Router();
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
  port:  parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: false, // Se você estiver usando o Azure
    trustServerCertificate: true // Altere esta opção se estiver usando SSL
  }
};

const pool = new mssql.ConnectionPool(config);

router.get('/test-connection', async (req, res) => {
  try {
    await mssql.connect(config);
    const result = await mssql.query`SELECT 1 AS Result`;
    console.dir(result);
    res.send('Conexão com o banco de dados bem-sucedida.!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Falha ao conectar ao banco de dados.');
  } finally {
    await mssql.close();
  }
});

module.exports = router;