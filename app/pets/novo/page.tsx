"use client";

import { useState } from "react";
import Link from "next/link";

export default function NovoPet() {

  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("");
  const [raca, setRaca] = useState("");
  const [porte, setPorte] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [clientes, setClientes] = useState<any[]>([]);

  
  const [buscaCliente, setBuscaCliente] = useState("");
  
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);

  async function buscarClientes(valor: string) {
    setBuscaCliente(valor);

    if (valor.length < 2) {
      setClientes([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/clientes/busca?nome=${valor}`
      );

      const data = await response.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  }

  function selecionarCliente(cliente: any) {
    setClienteSelecionado(cliente);
    setBuscaCliente(cliente.nome);
    setClientes([]);
  }

  async function salvarPet(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!clienteSelecionado) {
      alert("Selecione um cliente");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          especie,
          raca,
          porte,
          data_nascimento: dataNascimento,
          id_cliente: clienteSelecionado.id
        })
      });

      if (response.ok) {
        alert("Pet cadastrado com sucesso!");

        // limpar campos
        setNome("");
        setEspecie("");
        setRaca("");
        setPorte("");
        setDataNascimento("");
        setBuscaCliente("");
        setClienteSelecionado(null);
      } else {
        const erro = await response.json();
        alert(erro.error || "Erro ao cadastrar pet");
      }

    } catch (error) {
      console.error(error);
      alert("Erro de conexão com backend");
    }
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Cadastro de Pet
      </h1>

      <div className="bg-white p-6 rounded shadow max-w-md">

        <form onSubmit={salvarPet} className="flex flex-col gap-4">

          <input
            placeholder="Nome do pet"
            className="border p-2 rounded"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            placeholder="Espécie"
            className="border p-2 rounded"
            value={especie}
            onChange={(e) => setEspecie(e.target.value)}
          />

          <input
            placeholder="Raça"
            className="border p-2 rounded"
            value={raca}
            onChange={(e) => setRaca(e.target.value)}
          />

          <input
            placeholder="Porte"
            className="border p-2 rounded"
            value={porte}
            onChange={(e) => setPorte(e.target.value)}
          />

        
          <input
            type="date"
            className="border p-2 rounded"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
          />

        
          <div className="relative">
            <input
              placeholder="Buscar cliente..."
              className="border p-2 rounded w-full"
              value={buscaCliente}
              onChange={(e) => buscarClientes(e.target.value)}
            />

            {clientes.length > 0 && (
              <ul className="absolute bg-white border w-full mt-1 max-h-40 overflow-y-auto z-10">
                {clientes.map((c) => (
                  <li
                    key={c.id}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => selecionarCliente(c)}
                  >
                    {c.nome}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {clienteSelecionado && (
            <p className="text-sm text-green-600">
              Cliente selecionado: {clienteSelecionado.nome}
            </p>
          )}

          <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Salvar Pet
          </button>

        </form>

      </div>

      <div className="mt-6">
        <Link href="/pets">
          <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            Voltar
          </button>
        </Link>
      </div>

    </div>
  );
}