import { IconLogout2, IconUser, IconUsersPlus, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import RolesCard from "@/components/ui/tablerole";
import { dataroles } from "../../../../mock/roledata";

export default function RolesPage() {
  return (
    <section id="container" className="flex h-screen justify-center">

      <section id="content" className="bg-white w-[85%] ">
         <input
        type="text"
        placeholder="Cari Hak Akses"
        className="border rounded w-full p-2 mb-4"
      />
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">No</th>
              <th className="p-2">Hak Akses</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {dataroles.map((item, index) => (
              <RolesCard key={index} id={item.id} role={item.role}/>
            ))}
          </tbody>
        </table>
      </section>

      <button className="absolute bottom-10 right-6 bg-gray-300 hover:bg-gray-100 text-xl w-15 h-10 rounded flex items-center justify-center">
        <IconPlus />
      </button>
    </section>
  );
}
