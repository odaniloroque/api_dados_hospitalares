const express = require('express');
// const mssql = require('mssql');
const morgan = require('morgan');
const config = require('./databases')

const app = express();

// require('dotenv').config();

app.use(express.json());
app.use(morgan('tiny'));

// const config = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_DATABASE,
//   port:  parseInt(process.env.DB_PORT, 10),
//   options: {
//     encrypt: false, // Se você estiver usando o Azure
//     trustServerCertificate: true // Altere esta opção se estiver usando SSL
//   }
// };

// const pool = new mssql.ConnectionPool(config);

// Teste realizado no inicio para verificar as coneções
// pool.connect(err => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Conectado ao MSSQL');
//   }
// });


const pag_inicial = require('./pag_inicial')
const pag_manutencao = require('./pag_manutencao')
const pag_connection = require('./pag_connection')

app.use('/', pag_inicial);
app.get('/manutencao', pag_manutencao);
app.get('/test-connection' ,pag_connection);

app.get('/dados_do_paciente', async (req, res) => {
  const emManutencao = true;
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
          const result = await mssql.query(
    `SELECT Profissionais.Nome_do_profissional
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
  } else { 
    
    try {
      await sql.connect(config);
      const result = await sql.query(`sss`);
      res.json(result.recordset)
    } catch (error) {
      console.log(err);
      res.status(500).send('Erro no servidor')
    } finally {
      sql.close();
    }
}
});

app.get('/transferencia', async (req, res) => {
  const emManutencao = true;
  if (emManutencao) {
    res.redirect('/manutencao');
  } else { //aguardando bloco de codigo,
    try {
      await sql.connect(config);
      const result = await sql.query(`sss`);
      res.json(result.recordset)
    } catch (error) {
      console.log(err);
      res.status(500).send('Erro no servidor')
    } finally {
      sql.close();
    }
       }
});

app.get('/internacao', async (req, res) => {
  const emManutencao = true;
  if (emManutencao) {
    res.redirect('/manutencao');
  } else { //aguardando bloco de codigo
    try {
      await sql.connect(config);
      const result = await sql.query(`sss`);
      res.json(result.recordset)
    } catch (error) {
      console.log(err);
      res.status(500).send('Erro no servidor')
    } finally {
      sql.close();
    }
       }
});

app.get('/cirurgia', async (req, res) => {
  const emManutencao = true;
  if (emManutencao) {
    res.redirect('/manutencao');
  } else { //aguardando bloco de codigo
    try {
      await sql.connect(config);
      const result = await sql.query(`sss`);
      res.json(result.recordset)
    } catch (error) {
      console.log(err);
      res.status(500).send('Erro no servidor')
    } finally {
      sql.close();
    }
       }
});

app.get('/alta_hospitalar', async (req, res) => {
  const emManutencao = true;
  if (emManutencao) {
    res.redirect('/manutencao');
  } else { //aguardando bloco de codigo
    try {
      await sql.connect(config);
      const result = await sql.query(`sss`);
      res.json(result.recordset)
    } catch (error) {
      console.log(err);
      res.status(500).send('Erro no servidor')
    } finally {
      sql.close();
    }
       }
});

app.get('/dados_do_leito', async (req, res) => {
  const emManutencao = true;
  if (emManutencao) {
    res.redirect('/manutencao');
  } else { //aguardando bloco de codigo
    try {
      await sql.connect(config);
      const result = await sql.query(`sss`);
      res.json(result.recordset)
    } catch (error) {
      console.log(err);
      res.status(500).send('Erro no servidor')
    } finally {
      sql.close();
    }
       }
});


app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
