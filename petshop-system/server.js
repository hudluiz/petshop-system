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
});