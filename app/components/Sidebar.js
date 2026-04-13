import Link from "next/link"

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-blue-900 text-white p-6">

      <h1 className="text-2xl font-bold mb-10">
        PetShop System
      </h1>

      <ul className="space-y-4">

        <li className="hover:bg-blue-700 p-2 rounded cursor-pointer">
          Dashboard
        </li>


        <Link href="/clientes">
          <li className="hover:bg-blue-700 p-2 rounded cursor-pointer">
            Clientes
          </li>
        </Link>


     
     <Link href="/pets">
          <li className="hover:bg-blue-700 p-2 rounded cursor-pointer">
            Pets
          </li>
        </Link>


      </ul>

    </div>
  )
}