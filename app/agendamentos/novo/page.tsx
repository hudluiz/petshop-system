"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Cliente = {
  id?: number;
  id_cliente?: number;
  nome: string;
};

type Pet = {
  id_pet: number;
  nome: string;
};

type Servico = {
  id_servico: number;
  nome: string;
  valor: number;
};

export default function NovoAgendamento() {

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);

  const [buscaCliente, setBuscaCliente] = useState("");

  const [clienteSelecionado, setClienteSelecionado] =
    useState<Cliente | null>(null);

  const [petSelecionado, setPetSelecionado] =
    useState("");

  const [servicoSelecionado, setServicoSelecionado] =
    useState("");

  const [dataAgendamento, setDataAgendamento] =
    useState("");

  const [horaAgendamento, setHoraAgendamento] =
    useState("");

  const [observacoes, setObservacoes] =
    useState("");

  // =========================
  // CARREGAR SERVIÇOS
  // =========================

  useEffect(() => {
    carregarServicos();
  }, []);

  async function carregarServicos() {
    try {

      const response = await fetch(
        "http://localhost:3001/servicos"
      );

      const data = await response.json();

      setServicos(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error(
        "Erro ao carregar serviços:",
        error
      );
    }
  }

  // =========================
  // BUSCAR CLIENTES
  // =========================

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

      console.log(error);
    }
  }

  // =========================
  // SELECIONAR CLIENTE
  // =========================

  async function selecionarCliente(cliente: Cliente) {

    setClienteSelecionado(cliente);

    setBuscaCliente(cliente.nome);

    setClientes([]);

    try {

      const idCliente =
        cliente.id ?? cliente.id_cliente;

      const response = await fetch(
        `http://localhost:3001/pets/cliente/${idCliente}`
      );

      const data = await response.json();

      setPets(Array.isArray(data) ? data : []);

    } catch (error) {

      console.log(error);
    }
  }

  // =========================
  // SALVAR AGENDAMENTO
  // =========================

  async function salvarAgendamento(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();

    if (!clienteSelecionado) {
      alert("Selecione um cliente");
      return;
    }

    if (!petSelecionado) {
      alert("Selecione um pet");
      return;
    }

    if (!servicoSelecionado) {
      alert("Selecione um serviço");
      return;
    }

    if (!dataAgendamento) {
      alert("Informe a data");
      return;
    }

    if (!horaAgendamento) {
      alert("Informe a hora");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:3001/agendamentos",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            id_cliente:
              clienteSelecionado.id ??
              clienteSelecionado.id_cliente,

            id_pet: Number(petSelecionado),

            id_servico: Number(servicoSelecionado),

            data_agendamento: dataAgendamento,

            hora_agendamento: horaAgendamento,

            observacoes
          })
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert("Agendamento criado com sucesso!");

        setBuscaCliente("");
        setClienteSelecionado(null);

        setClientes([]);
        setPets([]);

        setPetSelecionado("");
        setServicoSelecionado("");

        setDataAgendamento("");
        setHoraAgendamento("");

        setObservacoes("");

      } else {

        alert(
          data.error ||
          "Erro ao criar agendamento"
        );
      }

    } catch (error) {

      console.error(error);

      alert("Erro ao conectar backend");
    }
  }

  return (

    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Novo Agendamento
      </h1>

      <div className="bg-white p-6 rounded shadow max-w-md">

        <form
          onSubmit={salvarAgendamento}
          className="flex flex-col gap-4"
        >

          {/* CLIENTE */}

          <div className="relative">

            <input
              placeholder="Buscar cliente..."
              className="border p-2 rounded w-full"
              value={buscaCliente}
              onChange={(e) =>
                buscarClientes(e.target.value)
              }
            />

            {clientes.length > 0 && (

              <ul className="absolute bg-white border w-full mt-1 max-h-40 overflow-y-auto z-10 rounded shadow">

                {clientes.map((c) => (

                  <li
                    key={c.id ?? c.id_cliente}

                    className="p-2 hover:bg-gray-200 cursor-pointer"

                    onClick={() =>
                      selecionarCliente(c)
                    }
                  >
                    {c.nome}
                  </li>

                ))}

              </ul>

            )}

          </div>

          {/* PET */}

          <select
            className="border p-2 rounded"
            value={petSelecionado}
            onChange={(e) =>
              setPetSelecionado(e.target.value)
            }
          >

            <option value="">
              Selecione o Pet
            </option>

            {pets.map((pet) => (

              <option
                key={pet.id_pet}
                value={pet.id_pet}
              >
                {pet.nome}
              </option>

            ))}

          </select>

          {/* SERVIÇOS */}

          <select
            className="border p-2 rounded"
            value={servicoSelecionado}
            onChange={(e) =>
              setServicoSelecionado(
                e.target.value
              )
            }
          >

            <option value="">
              Selecione o Serviço
            </option>

            {servicos.map((servico) => (

              <option
                key={servico.id_servico}
                value={servico.id_servico}
              >
                {servico.nome} - R$ {Number(servico.valor).toFixed(2)}
              </option>

            ))}

          </select>

          {/* DATA */}

          <input
            type="date"
            className="border p-2 rounded"
            value={dataAgendamento}
            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) =>
              setDataAgendamento(
                e.target.value
              )
            }
          />

          {/* HORA */}

          <input
            type="time"
            className="border p-2 rounded"
            value={horaAgendamento}
            onChange={(e) =>
              setHoraAgendamento(
                e.target.value
              )
            }
          />

          {/* OBSERVAÇÕES */}

          <textarea
            placeholder="Observações"
            className="border p-2 rounded"
            value={observacoes}
            onChange={(e) =>
              setObservacoes(
                e.target.value
              )
            }
          />

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Salvar Agendamento
          </button>

        </form>

      </div>

      <div className="mt-6">

        <Link href="/agendamentos">

          <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">

            Voltar

          </button>

        </Link>

      </div>

    </div>
  );
}