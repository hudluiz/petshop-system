"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Servicos() {

  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    carregarServicos();
  }, []);

  async function carregarServicos() {

    const response = await fetch(
      "http://localhost:3001/servicos"
    );

    const data = await response.json();

    setServicos(data);
  }

  return (

    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Serviços
      </h1>

      <div className="bg-white p-6 rounded shadow">

        <div className="flex justify-between mb-4">

          <h2 className="text-xl font-semibold">
            Lista de Serviços
          </h2>

          <Link href="/servicos/novo">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Novo Serviço
            </button>
          </Link>

        </div>

        <table className="w-full border">

          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Nome</th>
              <th className="p-2">Descrição</th>
              <th className="p-2">Valor</th>
            </tr>
          </thead>

          <tbody>

            {servicos.map((s: any) => (

              <tr key={s.id_servico}>

                <td className="p-2">{s.nome}</td>

                <td className="p-2">
                  {s.descricao}
                </td>

                <td className="p-2">
                  R$ {Number(s.valor).toFixed(2)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="mt-6">
          <Link href="/">
            <button className="bg-gray-600 text-white px-4 py-2 rounded">
              Voltar ao Dashboard
            </button>
          </Link>
        </div>
      </div>

    </div>


  );
}