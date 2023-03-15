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
    encrypt: false, // Se você estiver usando o Azure
    trustServerCertificate: true // Altere esta opção se estiver usando SSL
  }
};

const pool = new mssql.ConnectionPool(config);
// Teste realizado no inicio para verificar as coneções
pool.connect(err => {
  if (err) {
    console.error(err);
  } else {
    console.log('Conectado ao MSSQL');
  }
});


app.get('/', (req, res) => { });

app.get('/dados_do_paciente', async (req, res) => {
  try {
    await mssql.connect(config)
    const result = await mssql.query(`SELECT nome_paciente AS nome_do_paciente
          ,cpf
          ,Data_nascimento AS data_de_nascimento
          ,Nacionalidade.Descricao AS nacionalidade
          ,NULL AS naturalidade
          ,NULL AS genero
          ,NULL AS raca
          ,Numero_da_matricula AS cartao_sus
          ,Nome_da_mae AS nome_da_mae
          ,'Endereço: CEP: ' + Cep + ' - ' + Endereco + '- Nrº: ' + EnderecoNr + '- Complemento: ' + isnull(EnderecoCompl, 0) + '- Bairro: ' + Bairros.Descricao + '- Cidade: ' + Cidade.Nome_da_cidade AS endereco
          ,Telefone_contato
          ,Prontuario
        FROM paciente
        INNER JOIN Nacionalidade ON Nacionalidade.[Codigo da nacionalidade] = Paciente.[Codigo da nacionalidade]
        INNER JOIN Cidade ON Cidade.Codigo_da_cidade = Paciente.Codigo_da_cidade
        INNER JOIN Bairros ON Bairros.Codigo_do_bairro = Paciente.Codigo_do_bairro
        WHERE Prontuario NOT IN (
            0
            ,1
            )`);
    res.json(result.recordset);
  } catch (err) {
    console.log(err);
    res.status(500).send('Erro no servidor')
  } finally {
    mssql.close();
  }
});

app.get('/dados_unidade_saude', async (req, res) => {
  try {
    await mssql.connect(config);
    const result = await mssql.query(`SELECT cnes
              ,descricao AS nome
              ,0 AS sigla
              ,0 AS tipo_da_unidade
              ,Endereco + ' + Cidade: ' + cidade.Nome_da_cidade AS endereco
            FROM [Unidades operacionais]
            INNER JOIN cidade ON cidade.Codigo_da_cidade = [Unidades operacionais].Codigo_da_cidade`);
    res.json(result.recordset);
  } catch (error) {
    console.log(err);
    res.status(500).send('Erro no servidor')
  } finally {
    mssql.close();
  }

})



app.get('/test-connection', async (req, res) => {
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


app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
