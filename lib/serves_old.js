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
    const clientes = await db.query("SELECT * FROM clientes");
    res.json(clientes.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
});

app.listen(3001, () => {
  console.log("🚀 Servidor 1rodando em http://localhost:3001");
});