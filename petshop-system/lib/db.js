import pkg from "pg";

const { Pool } = pkg;

const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "petshop",
  password: "Hlcsamacbh1@#",
  port: 5432
});

export default db;