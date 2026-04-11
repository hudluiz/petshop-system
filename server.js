import express from "express";
import cors from "cors";
import db from "./lib/db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Petshop funcionando 🚀");
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

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
<<<<<<< HEAD
=======
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
>>>>>>> 8288df8 (Initial commit)
});