"use client";

import { useState } from "react";
import Link from "next/link";
export default function NovoCliente() {

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");

 async function salvarCliente(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3001/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        telefone,
        email,
        endereco
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Cliente cadastrado com sucesso!");
      console.log("Sucesso:", data);

      setNome("");
      setTelefone("");
      setEmail("");
      setEndereco("");
    } else {
      console.log("Erro retornado pela API:", data);
      alert(data.error || "Erro ao cadastrar cliente");
    }
  } catch (error) {
    console.error("Erro no fetch:", error);
    alert("Não foi possível conectar ao backend");
  }
}
  return (

    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Cadastro de Cliente
      </h1>

      <form onSubmit={salvarCliente} className="flex flex-col gap-4 max-w-md">

        <input
          type="text"
          placeholder="Nome"
          className="border p-2 rounded"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          type="text"
          placeholder="Telefone"
          className="border p-2 rounded"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Endereço"
          className="border p-2 rounded"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Salvar Cliente
        </button>

      </form>

      <div className="mt-6">
        <Link href="/">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Voltar ao Dashboard
          </button>
        </Link>
      </div>
    </div>
    
  );
}