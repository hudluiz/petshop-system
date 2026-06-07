"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Agendamento = {
  id_agendamento: number;
  cliente: string;
  pet: string;
  servico: string;
  valor: string;
};

export default function NovaCobranca() {

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [agendamentoSelecionado, setAgendamentoSelecionado] =
    useState<Agendamento | null>(null);

  const chavePix =
    "petshoptcc@gmail.com";

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  async function carregarAgendamentos() {

    try {

      const response = await fetch(
        "http://localhost:3001/agendamentos"
      );

      const data = await response.json();

      setAgendamentos(
        Array.isArray(data) ? data : []
      );

    } catch (error) {

      console.error(error);
    }
  }

  function selecionarAgendamento(
    id: number
  ) {

    const agendamento =
      agendamentos.find(
        (a) =>
          a.id_agendamento === id
      );

    setAgendamentoSelecionado(
      agendamento || null
    );
  }

async function enviarEmail() {

  if (!agendamentoSelecionado) {

    alert("Selecione um agendamento");
    return;
  }

  try {

    const response = await fetch(
      "http://localhost:3001/cobrancas",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          id_agendamento:
            agendamentoSelecionado.id_agendamento
        })
      }
    );

    const data = await response.json();

    console.log(data);

    if (response.ok) {

      alert(
        "Cobrança enviada com sucesso!"
      );

    } else {

      alert(
        data.error ||
        "Erro ao enviar cobrança"
      );
    }

  } catch (error) {

    console.error(error);

    alert(
      "Erro ao conectar backend"
    );
  }
}

  return (

    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">

        Nova Cobrança

      </h1>

      <div className="bg-white p-6 rounded shadow">

        <div className="mb-6">

          <label className="block mb-2 font-semibold">

            Selecione o Agendamento

          </label>

          <select
            className="border p-2 rounded w-full"

            onChange={(e) =>
              selecionarAgendamento(
                Number(
                  e.target.value
                )
              )
            }
          >

            <option value="">

              Escolha um agendamento

            </option>

            {agendamentos.map((a) => (

              <option
                key={
                  a.id_agendamento
                }

                value={
                  a.id_agendamento
                }
              >

                #{a.id_agendamento}
                {" - "}
                {a.cliente}
                {" - "}
                {a.pet}

              </option>

            ))}

          </select>

        </div>

        {agendamentoSelecionado && (

          <div className="border rounded p-6 bg-gray-50">

            <h2 className="text-xl font-bold mb-4">

              Cobrança

            </h2>

            <div className="space-y-2">

              <p>
                <strong>
                  Cliente:
                </strong>{" "}
                {
                  agendamentoSelecionado.cliente
                }
              </p>

              <p>
                <strong>
                  Pet:
                </strong>{" "}
                {
                  agendamentoSelecionado.pet
                }
              </p>

              <p>
                <strong>
                  Serviço:
                </strong>{" "}
                {
                  agendamentoSelecionado.servico
                }
              </p>

              <p>
                <strong>
                  Valor:
                </strong>{" "}
                R$
                {Number(
                  agendamentoSelecionado.valor
                ).toFixed(2)}
              </p>

            </div>

            <hr className="my-4" />

            <h3 className="font-bold text-lg">

              Pagamento via PIX

            </h3>

            <div className="bg-white border p-4 rounded mt-2">

              <p>

                <strong>
                  Chave PIX:
                </strong>

              </p>

              <p className="text-blue-600">

                {chavePix}

              </p>

            </div>

            <div className="mt-6 flex gap-4">

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    chavePix
                  )
                }

                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >

                Copiar PIX

              </button>

              <button
                onClick={
                  enviarEmail
                }

                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >

                Enviar por E-mail

              </button>

            </div>

          </div>

        )}

      </div>

      <div className="mt-6">

        <Link href="/">

          <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">

            Voltar ao Dashboard

          </button>

        </Link>

      </div>

    </div>
  );
}