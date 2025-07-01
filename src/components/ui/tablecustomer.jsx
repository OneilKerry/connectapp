import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomerTable({ id, name, email, onDelete }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/customers/update/${id}`);
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(`Yakin ingin hapus customer "${name}"?`);
    if (confirmDelete) {
      await onDelete(id);
    }
  };

  return (
    <tr className="border-b">
      <td className="p-2">{name}</td>
      <td className="p-2">{email}</td>
      <td className="p-2 flex gap-2">
        <Pencil
          size={16}
          className="cursor-pointer text-gray-600 hover:text-black"
          onClick={handleEdit}
        />
        <Trash2
          size={16}
          className="cursor-pointer text-red-500 hover:text-red-700"
          onClick={handleDelete}
        />
      </td>
    </tr>
  );
}
