const express = require('express');
const router = express.Router();


router.get('/', (req, res) => { 
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
        <a href="./test-connection">...</a>
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

module.exports = router;