"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import iconPata from "../public/patas.png";
import Image from "next/image";
import Link from "next/link";

type Cliente = {
  id?: number;
  id_cliente?: number;
  nome: string;
};

type Pet = {
  id_pet?: number;
  nome: string;
};

export default function Home() {
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalPets, setTotalPets] = useState(0);

  useEffect(() => {
    async function carregarClientes() {
      try {
        const response = await fetch("http://localhost:3001/clientes");
        const data: Cliente[] = await response.json();
        setTotalClientes(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    }

    async function carregarPets() {
      try {
        const response = await fetch("http://localhost:3001/pets");
        const data: Pet[] = await response.json();
        setTotalPets(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
      }
    }

    carregarClientes();
    carregarPets();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-10 bg-gray-100 min-h-screen">
        <h1 className="flex items-center gap-3 text-3xl font-bold mb-6">
          <Link href="/">
            <Image
              src={iconPata}
              height={40}
              width={40}
              alt="Logo PetShop"
            />
          </Link>

          Dashboard PetShop
        </h1>

        <div className="grid grid-cols-3 gap-6">
          <Link href="/clientes">
            <div className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg hover:bg-gray-50 transition">
              <h2 className="text-gray-500">Clientes</h2>
              <p className="text-2xl font-bold">{totalClientes}</p>
            </div>
          </Link>

          <Link href="/pets">
            <div className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg hover:bg-gray-50 transition">
              <h2 className="text-gray-500">Pets</h2>
              <p className="text-2xl font-bold">{totalPets}</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}