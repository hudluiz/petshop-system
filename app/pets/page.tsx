"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Pet = {
  id_pet: number;
  nome: string;
  especie: string;
  raca: string;
  porte?: string;
  data_nascimento : string;
  nome_cliente: string;
};

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarPets() {
    try {
      setCarregando(true);
      setErro("");

      const response = await fetch("http://localhost:3001/pets", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar pets");
      }

      const data = await response.json();
      setPets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os pets.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPets();
  }, []);

  const petsFiltrados = pets
    .filter((pet) => {
      const texto = busca.toLowerCase();

      return (
        pet.nome?.toLowerCase().includes(texto) ||
        pet.especie?.toLowerCase().includes(texto) ||
        pet.raca?.toLowerCase().includes(texto) ||
        pet.nome_cliente?.toLowerCase().includes(texto) ||
        pet.data_nascimento?.toLowerCase().includes(texto)
      );
    })
    .slice(0, 10);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Pets</h1>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">Lista de Pets</h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Buscar por nome, espécie, raça ou cliente"
              className="border px-3 py-2 rounded w-72"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

            <Link href="/pets/novo">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Novo Pet
              </button>
            </Link>
          </div>
        </div>

        {carregando && (
          <p className="text-gray-600">Carregando pets...</p>
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
                <th className="p-2 text-left">Espécie</th>
                <th className="p-2 text-left">Raça</th>
                <th className="p-2 text-left">Cliente</th>
                 <th className="p-2 text-left">Data Nascimento</th>
              </tr>
            </thead>

            <tbody>
              {petsFiltrados.length > 0 ? (
                petsFiltrados.map((pet) => (
                  <tr key={pet.id_pet} className="border-t">
                    <td className="p-2">{pet.id_pet}</td>
                    <td className="p-2">{pet.nome}</td>
                    <td className="p-2">{pet.especie}</td>
                    <td className="p-2">{pet.raca}</td>
                    <td className="p-2">{pet.nome_cliente}</td>
                    <td className="p-2">{formatarData(pet.data_nascimento)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    Nenhum pet encontrado.
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
function formatarData(data: string) {
  if (!data) return "";

  const date = new Date(data);

  return date.toLocaleDateString("pt-BR");
}