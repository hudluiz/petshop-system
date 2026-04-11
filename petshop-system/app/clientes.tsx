import Link from "next/link";


export default function Clientes() {

  //const db = require("../database/db");
  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Clientes
      </h1>

      <div className="bg-white p-6 rounded shadow">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Lista de Clientes
          </h2>

          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            
            Novo Cliente
          </button>
           
          
        </div>

        <table className="w-full border">

          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Telefone</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="p-2">1</td>
              <td className="p-2">João Silva</td>
              <td className="p-2">(11) 99999-9999</td>
              <td className="p-2">joao@email.com</td>
              <td className="p-2">
                <button className="text-blue-500 mr-2">
                  Editar
                </button>

                <button className="text-red-500">
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>

        </table>

      </div>

      <div className="mt-6">
        <Link href="/">
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Voltar ao Dashboard
          </button>
        </Link>
      </div>

    </div>
  );
}