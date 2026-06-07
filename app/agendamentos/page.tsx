"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Agendamento = {
  id_agendamento: number;
  cliente: string;
  pet: string;
  servico: string;
  valor: string;
  data_agendamento: string;
  hora_agendamento: string;
  status: string;
  observacoes?: string;
};

export default function Agendamentos() {

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  async function carregarAgendamentos() {

    try {

      const response = await fetch("http://localhost:3001/agendamentos");

      const data = await response.json();
      console.log(data);

      setAgendamentos(Array.isArray(data) ? data : []);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  function formatarData(data: string) {

    if (!data) return "";

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Agendamentos
      </h1>

      <div className="bg-white p-6 rounded shadow">

        <div className="flex justify-between mb-4">

          <h2 className="text-xl font-semibold">
            Lista de Agendamentos
          </h2>

          <Link href="/agendamentos/novo">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Novo Agendamento
            </button>
          </Link>

        </div>

        <table className="w-full border">

          <thead className="bg-gray-200">

            <tr>
              <th className="p-2 text-left">Cliente</th>
              <th className="p-2 text-left">Pet</th>
              <th className="p-2 text-left">Serviço</th>
              <th className="p-2 text-left">Data</th>
              <th className="p-2 text-left">Hora</th>
              <th className="p-2 text-left">Status</th>
            </tr>

          </thead>

          <tbody>

            {agendamentos.map((a) => (

              <tr
                key={a.id_agendamento}
                className="border-t"
              >

                <td className="p-2">{a.cliente}</td>
                <td className="p-2">{a.pet}</td>
                <td className="p-2">{a.servico}</td>
                <td className="p-2">
                  {formatarDataAgendamento(a.data_agendamento)}
                </td>
                <td className="p-2">{a.hora_agendamento}</td>
                <td className="p-2">{a.status}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-6">
        <Link href="/">
          <button className="bg-gray-600 text-white px-4 py-2 rounded">
            Voltar ao Dashboard
          </button>
        </Link>
      </div>

    </div>
  );
}

function formatarData(data: string) {

  if (!data) return "";

  const novaData = new Date(data);

  return novaData.toLocaleDateString("pt-BR");
}

function formatarDataAgendamento(data: string) {

  if (!data) return "";

  const novaData = new Date(data);

  return novaData.toLocaleDateString("pt-BR");
}