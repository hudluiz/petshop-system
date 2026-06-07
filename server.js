import express from "express";
import cors from "cors";
import db from "./lib/db.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Petshop funcionando ");
});

app.get("/clientes", async (req, res) => {
  try {
    const clientes = await db.query("SELECT * FROM clientes ORDER BY id");
    res.json(clientes.rows);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/clientes", async (req, res) => {
  try {
    console.log("Body recebido:", req.body);

    const { nome, telefone, email, endereco } = req.body;

    const novo = await db.query(
      "INSERT INTO clientes (nome, telefone, email, endereco) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, telefone, email, endereco]
    );

    res.status(201).json(novo.rows[0]);
  } catch (error) {
    console.error("Erro ao inserir cliente:", error);
    res.status(500).json({ error: error.message });
  }
});


app.post("/pets", async (req, res) => {
  try {
    const {
      nome,
      especie,
      raca,
      porte,
      data_nascimento,
      id_cliente
    } = req.body;

    const novoPet = await db.query(
      `INSERT INTO pets
      (nome, especie, raca, porte, data_nascimento, id_cliente)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [nome, especie, raca, porte, data_nascimento, id_cliente]
    );

    res.status(201).json(novoPet.rows[0]);
  } catch (error) {
    console.error("Erro ao cadastrar pet:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/pets", async (req, res) => {
  try {
    const pets = await db.query(`
      SELECT p.*, c.nome AS nome_cliente
      FROM pets p
      INNER JOIN clientes c ON p.id_cliente = c.id
      ORDER BY p.id_pet ASC
    `);

    res.json(pets.rows);
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/clientes/busca", async (req, res) => {
  try {
    const { nome } = req.query;

    const clientes = await db.query(
      "SELECT id, nome FROM clientes WHERE nome ILIKE $1 LIMIT 10",
      [`%${nome}%`]
    );

    res.json(clientes.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

});

app.get("/agendamentos", async (req, res) => {

  try {

    const resultado = await db.query(`
      SELECT
        a.id_agendamento,
        c.nome AS cliente,
        p.nome AS pet,
        s.nome AS servico,
        s.valor,
        a.data_agendamento,
        a.hora_agendamento,
        a.status,
        a.observacoes
      FROM agendamentos a
      INNER JOIN clientes c
        ON c.id = a.id_cliente
      INNER JOIN pets p
        ON p.id_pet = a.id_pet
      INNER JOIN servicos s
        ON s.id_servico = a.id_servico
      ORDER BY a.data_agendamento,
               a.hora_agendamento
    `);

    res.json(resultado.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao buscar agendamentos"
    });
  }
});

app.get("/pets/cliente/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const result = await db.query(
      `
      SELECT *
      FROM pets
      WHERE id_cliente = $1
      `,
      [id]
    );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Erro ao buscar pets"
    });
  }
});

app.post("/agendamentos", async (req, res) => {

  try {

    const {
      id_cliente,
      id_pet,
      id_servico,
      data_agendamento,
      hora_agendamento,
      observacoes
    } = req.body;

    const novoAgendamento = await db.query(
      `
      INSERT INTO agendamentos
      (
        id_cliente,
        id_pet,
        id_servico,
        data_agendamento,
        hora_agendamento,
        observacoes
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        id_cliente,
        id_pet,
        id_servico,
        data_agendamento,
        hora_agendamento,
        observacoes
      ]
    );

    res.json(novoAgendamento.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao criar agendamento"
    });
  }
});

app.get("/servicos", async (req, res) => {
  try {

    const resultado = await db.query(`
      SELECT *
      FROM servicos
      WHERE ativo = true
      ORDER BY nome
    `);

    res.json(resultado.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao buscar serviços"
    });

  }
});

app.post("/servicos", async (req, res) => {

  try {

    const {
      nome,
      descricao,
      valor
    } = req.body;

    const resultado = await db.query(
      `
      INSERT INTO servicos
      (nome, descricao, valor)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [nome, descricao, valor]
    );

    res.json(resultado.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao cadastrar serviço"
    });

  }
});

app.get("/agendamentos/cobranca", async (req, res) => {

  const result = await db.query(`
    SELECT
      a.id_agendamento,
      c.nome AS cliente,
      p.nome AS pet,
      s.nome AS servico,
      s.valor,
      c.email
    FROM agendamentos a
    INNER JOIN clientes c
      ON c.id = a.id_cliente
    INNER JOIN pets p
      ON p.id_pet = a.id_pet
    INNER JOIN servicos s
      ON s.id_servico = a.id_servico
    ORDER BY a.id_agendamento DESC
  `);

  res.json(result.rows);
});

app.post("/cobrancas", async (req, res) => {

  try {

    const {
      id_agendamento
    } = req.body;

    const dados = await db.query(`
      SELECT
        a.id_agendamento,
        c.nome AS cliente,
        c.email,
        p.nome AS pet,
        s.nome AS servico,
        s.valor
      FROM agendamentos a
      INNER JOIN clientes c
        ON c.id = a.id_cliente
      INNER JOIN pets p
        ON p.id_pet = a.id_pet
      INNER JOIN servicos s
        ON s.id_servico = a.id_servico
      WHERE a.id_agendamento = $1
    `, [id_agendamento]);

    if (dados.rows.length === 0) {

      return res.status(404).json({
        error: "Agendamento não encontrado"
      });
    }

    const cobranca = dados.rows[0];

    console.log("Dados cobrança:");
    console.log(cobranca);

    console.log("PIX:", process.env.CHAVE_PIX);

    const resultado = await db.query(

      `
  INSERT INTO cobrancas
  (
    id_agendamento,
    valor,
    chave_pix
  )
  VALUES
  ($1,$2,$3)
  RETURNING *
  `,
      [
        id_agendamento,
        cobranca.valor,
        process.env.CHAVE_PIX
      ]
    );

    console.log(
      "Cobrança salva:",
      resultado.rows[0]
    );

    const html = `
      <h2>Cobrança PetShop</h2>

      <p>
        Cliente:
        ${cobranca.cliente}
      </p>

      <p>
        Pet:
        ${cobranca.pet}
      </p>

      <p>
        Serviço:
        ${cobranca.servico}
      </p>

      <p>
        Valor:
        R$ ${Number(cobranca.valor).toFixed(2)}
      </p>

      <hr>

      <h3>Pagamento via PIX</h3>

      <p>
        ${process.env.CHAVE_PIX}
      </p>
    `;

    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },

        tls: {
          rejectUnauthorized: false
        }
      });

    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: cobranca.email,

      subject: "Cobrança PetShop",

      html
    });

    res.json({
      sucesso: true,
      cobranca: resultado.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");

});
