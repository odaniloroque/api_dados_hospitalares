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
  port:  parseInt(process.env.DB_PORT, 10),
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

app.get('/', (req, res) => { 
  res.send(`
  <!DOCTYPE html>
    <html>
      <head>
        <title>Bem-vindo(a)!</title>
        <style>
          body {
            background-color: #f2f2f2;
            // background: linear-gradient(to bottom, #87CEFA, #FFFFFF);
            // background-image: linear-gradient(to bottom, #f5f5f5, #ffffff);
            // background-image: linear-gradient(to bottom, #87CEEB, #ffffff);
            // font-family: Arial, sans-serif;
            font-family: Helvetica, Arial, sans-serif;
            margin: 10px;
            padding: 0;
          }

          h1 {
            text-align: center;
            color: #023535;
            font-size: 40px;
          }

          h2 {
            margin: 0 0 0 50px;
             color: #333;
          }

          h3 {
             color: #333;
          }

          ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
          }

          li {
            margin: 10px 0;
          }
          p {
              color: #666;
              font-size: 12px;
            }

          a {
            color: #000;
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Bem-vindo(a)!</h1>
        <h2>Dados Gerais</h2>
        <ul>
          <h3>Dados do Paciente</h3>
          <p>nome do paciente; CPF; data de nascimento; nacionalidade;
          naturalidade; gênero; raça/cor; cartão SUS (CNS); nome da mãe; endereço (rua, número,
          Município, Estado); telefone e prontuário (número de identificação do paciente).</p>
          <li><a href="./dados_do_paciente">Link</a></li>
          <h3>Dados da Unidade de Saúde</h3>
          <p>CNES; nome; sigla; tipo da unidade e endereço (rua, número, Município, Estado).</p>
          <li><a href="./dados_unidade_saude">Link</a></li>
          <h3>Estrutura Hospitalar</h3>
          <p>total de leitos (enfermaria, emergência, internação, UTI, semi-UTI, CRPA, etc); total
          de salas cirúrgicas e total de consultórios (por especialidade).</p>
          <li><a href="./estrutura_hospitalar">Link</a></li>
          <h3>Dados do profissional</h3>
          <p>nome; CPF; cartão SUS (CNS); conselho; CBO; profissão; especialização; nacionalidade e telefone.</p>
          <li><a href="./dados_profissional">Link</a></li>
          <br>
          <h2>Movimentações</h2>
            <ul>
              <h3>Admissão</h3>
              <p>data e hora da entrada do paciente na unidade; tipo de atendimento (ambulatório,
                internação, emergência, regulação, etc); classificação de risco.</p>
              <li><a href="./admissao">Link</a></li>
              <h3>Transferência</h3>
              <p> movimentações de paciente entre setores da unidade de saúde;
              movimentações de paciente entre leitos da unidade de saúde; movimentações de paciente
              entre especialidades da unidade de saúde; movimentações de paciente entre clínicas da
              unidade de saúde (regulação ou entrada e saída entre unidades); data e hora das
              movimentações; nome da unidade (origem ou destino); CNES (origem ou destino).</p>
              <li><a href="./transferencia">Link</a></li>
              <h3>Internação</h3>
              <p>data e hora da entrada de paciente na unidade de saúde (admissão, regulação,
                eletiva, urgência, etc); prescrição de dieta; prescrição de procedimento; prescrição de
                medicamento; medicamento de uso continuo; prescrição de cuidado; evolução; anamnese.<p/>
              <li><a href="./internacao">Link</a></li>
              <h3>Cirurgia</h3>
              <p>tipo de cirurgia (eletiva ou emergencial); especialidade; procedimentos/operações
              executados (as) na unidade de saúde; data e hora início; data e hora final; status.</p>
              <li><a href="./cirurgia">Link</a></li>
              <h3>Alta Hospitalar</h3>
              <p>data e hora da saída do paciente; motivo (óbito, evasão, transferência,
                alta médica, etc).
                Campos importantes para movimentação: número de atendimento; especialidade; setor
                (origem e destino); tipo de leito (origem e destino); descrição do leito (origem e destino); nº do
                leito (origem e destino); tipo de movimentação (admissão, transferência, internação, cirurgia,
                alta hospitalar, etc); diagnóstico principal (CID); diagnóstico secundário (CID); procedimento.
                DADOS DO LEITO: total de leitos da unidade; ativos; disponíveis; ocupados; reservados.</p>
              <li><a href="./alta_hospitalar">Link</a></li>
            </ul>
          </li>
          <h3>Dados do leito</h3>
          <p>
            Campos importantes para leitos: número de atendimento (leito ocupado); especialidade;
            prontuário (leito ocupado); setor; tipo de leito; descrição do leito; nº do leito; situação do leito;
            data de criação do leito; data de atualização do leito; data e hora da ocupação do leito; data e
            hora da saída do leito.
          </p>
          <li><a href="./dados_do_leito">Link</a></li>
        </ul>
      </body>
    </html>
  `);
});

app.get('/dados_do_paciente', async (req, res) => {
  const emManutencao = false;
  if (emManutencao) {
    res.redirect('/manutencao');
  } else {
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
              ,Paciente.Prontuario
            FROM paciente
            INNER JOIN Paciente_internado ON Paciente.Prontuario = Paciente_internado.Prontuario 
                  AND Paciente_internado.Codigo_da_alta = 1
            INNER JOIN Nacionalidade ON Nacionalidade.[Codigo da nacionalidade] = Paciente.[Codigo da nacionalidade]
            INNER JOIN Cidade ON Cidade.Codigo_da_cidade = Paciente.Codigo_da_cidade
            INNER JOIN Bairros ON Bairros.Codigo_do_bairro = Paciente.Codigo_do_bairro
            WHERE Paciente.Prontuario NOT IN (
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
    }
});

app.get('/dados_unidade_saude', async (req, res) => {
  const emManutencao = false;
  if (emManutencao) {
    res.redirect('/manutencao');
  } else {
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
    }
})

app.get('/estrutura_hospitalar', async (req, res) => {
    const emManutencao = false;
    if (emManutencao) {
      res.redirect('/manutencao');
    } else {
      
  try {
          await mssql.connect(config);
          const result = await mssql.query(`SELECT Enfermaria.Descricao_da_enfermaria AS nome_enfermaria
                      ,count(leitos.[Numero_do_leito]) total_de_leitos
                      ,CASE dbo.Leitos.Status_do_leitos
                        WHEN 1
                          THEN 'Vago'
                        WHEN 2
                          THEN 'Ocupado'
                        WHEN 3
                          THEN 'Bloqueado'
                        WHEN 4
                          THEN 'Interditado'
                        WHEN 5
                          THEN 'Desinfecção'
                        WHEN 6
                          THEN 'Reservado'
                        END AS status_dos_leitos
                    FROM Leitos
                    INNER JOIN Enfermaria ON Enfermaria.Codigo_da_enfermaria = Leitos.Codigo_da_enfermaria
                    GROUP BY Enfermaria.Descricao_da_enfermaria
                      ,dbo.Leitos.Status_do_leitos
                    ORDER BY Enfermaria.Descricao_da_enfermaria`);
          res.json(result.recordset);
        } catch (error) {
          console.log(err);
          res.status(500).send('Erro no servidor')
        } finally {
          mssql.close();
        }
    }
})

app.get('/dados_profissional', async (req, res) => {
  const emManutencao = false;
  if (emManutencao) {
    res.redirect('/manutencao');
  } else {
        try {
          await mssql.connect(config);
          const result = await mssql.query(`SELECT Profissionais.Nome_do_profissional
          ,Profissionais.Cpf
          ,Profissionais.CNS
          ,[Conselhos regionais].[Descricao do conselho] AS conselho
          ,especialidades.cbo
          ,Funcao.Descricao AS funcao
          ,NULL AS profissao
          ,especialidades.Descricao_da_especialidad AS especialidade
          ,NULL AS nacionalidade
          ,Profissionais.Telefone_comercial AS telefone
        FROM Profissionais
        INNER JOIN Funcao ON Funcao.Codigo_da_funcao = Profissionais.Codigo_da_funcao
        INNER JOIN [Conselhos regionais] ON [Conselhos regionais].Codigo_conselho = Profissionais.Codigo_conselho
        INNER JOIN Especialidades ON Especialidades.Codigo_da_especialidade = Profissionais.Codigo_da_especialidade
        WHERE Profissionais.Codigo_do_profissional NOT IN (
            0
            ,1
            )`);
          res.json(result.recordset);
        } catch (error) {
          console.log(err);
          res.status(500).send('Erro no servidor')
        } finally {
          mssql.close();
        }
  }
});

app.get('/admissao', async (req, res) => {
  const emManutencao = true;
  if (emManutencao) {
    res.redirect('/manutencao');
  } else { //aguardando bloco de codigo
       }
});

app.get('/transferencia', async (req, res) => {
  const emManutencao = true;
  if (emManutencao) {
    res.redirect('/manutencao');
  } else { //aguardando bloco de codigo
       }
});

app.get('/internacao', async (req, res) => {
  const emManutencao = true;
  if (emManutencao) {
    res.redirect('/manutencao');
  } else { //aguardando bloco de codigo
       }
});

app.get('/cirurgia', async (req, res) => {
  const emManutencao = true;
  if (emManutencao) {
    res.redirect('/manutencao');
  } else { //aguardando bloco de codigo
       }
});

app.get('/alta_hospitalar', async (req, res) => {
  const emManutencao = true;
  if (emManutencao) {
    res.redirect('/manutencao');
  } else { //aguardando bloco de codigo
       }
});

app.get('/dados_do_leito', async (req, res) => {
  const emManutencao = true;
  if (emManutencao) {
    res.redirect('/manutencao');
  } else { //aguardando bloco de codigo
       }
});

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

app.get('/manutencao', function(req, res) {
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

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
