"use client";
import Link from "next/link";

import { useState } from "react";

export default function NovoServico() {

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  async function salvar(e: any) {

    e.preventDefault();

    await fetch(
      "http://localhost:3001/servicos",
      {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          nome,
          descricao,
          valor
        })
      }
    );

    alert("Serviço cadastrado!");
  }

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Novo Serviço
      </h1>

      <form
        onSubmit={salvar}
        className="flex flex-col gap-4 max-w-md"
      >

        <input
          placeholder="Nome"
          className="border p-2 rounded"
          value={nome}
          onChange={(e)=>setNome(e.target.value)}
        />

        <textarea
          placeholder="Descrição"
          className="border p-2 rounded"
          value={descricao}
          onChange={(e)=>setDescricao(e.target.value)}
        />

        <input
          type="number"
          step="0.01"
          placeholder="Valor"
          className="border p-2 rounded"
          value={valor}
          onChange={(e)=>setValor(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white p-2 rounded"
        >
          Salvar
        </button>

      </form>
 <div className="mt-6">

        <Link href="/servicos">

          <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">

            Voltar

          </button>

        </Link>

      </div>
    </div>

  );
}