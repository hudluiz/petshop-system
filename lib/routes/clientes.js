const express = require("express");
const router = express.Router();
const db = require("./lib/db");

router.get("/", async (req, res) => {
  const clientes = await db.query("SELECT * FROM clientes");
  res.json(clientes.rows);
});

router.post("/", async (req, res) => {

  const { nome, telefone, email, endereco } = req.body;

  const novo = await db.query(
    "INSERT INTO clientes (nome, telefone, email, endereco) VALUES ($1,$2,$3,$4) RETURNING *",
    [nome, telefone, email, endereco]
  );

  res.json(novo.rows[0]);

});

module.exports = router;