import { Pencil, Trash2 } from 'lucide-react';

export default function RolesCard({role, id }) {
  return (
    <tr className="border-b">
      <td className="p-2">{id}</td>
      <td className="p-2">{role}</td>
      <td className="p-2 flex gap-2">
        <Pencil size={16} className="cursor-pointer text-gray-600 hover:text-black" />
        <Trash2 size={16} className="cursor-pointer text-red-500 hover:text-red-700" />
      </td>
    </tr>
  );
}
