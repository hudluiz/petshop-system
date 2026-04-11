"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Cliente = {
  id?: number;
  id_cliente?: number;
  nome: string;
  telefone: string;
  email: string;
  endereco?: string;
};

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarClientes() {
    try {
      setCarregando(true);
      setErro("");

      const response = await fetch("http://localhost:3001/clientes", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar clientes");
      }

      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os clientes.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  const clientesFiltrados = clientes
    .filter((cliente) => {
      const texto = busca.toLowerCase();

      return (
        cliente.nome?.toLowerCase().includes(texto) ||
        cliente.telefone?.toLowerCase().includes(texto) ||
        cliente.email?.toLowerCase().includes(texto)
      );
    })
    .slice(0, 10);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Clientes</h1>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">Lista de Clientes</h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou e-mail"
              className="border px-3 py-2 rounded w-72"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

            <Link href="/clientes/novo">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Novo Cliente
              </button>
            </Link>
          </div>
        </div>

        {carregando && (
          <p className="text-gray-600">Carregando clientes...</p>
        )}

        {erro && (
          <p className="text-red-600 mb-4">{erro}</p>
        )}

        {!carregando && !erro && (
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nome</th>
                <th className="p-2 text-left">Telefone</th>
                <th className="p-2 text-left">Email</th>
               
              </tr>
            </thead>

            <tbody>
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente) => (
                  <tr
                    key={cliente.id_cliente ?? cliente.id}
                    className="border-t"
                  >
                    <td className="p-2">{cliente.id_cliente ?? cliente.id}</td>
                    <td className="p-2">{cliente.nome}</td>
                    <td className="p-2">{cliente.telefone}</td>
                    <td className="p-2">{cliente.email}</td>
                  
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

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