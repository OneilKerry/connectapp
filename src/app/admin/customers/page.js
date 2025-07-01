"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CustomerTable from "@/components/ui/tablecustomer";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleDeleteCustomer = async (id) => {
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) {
      console.error("Gagal hapus customer:", error);
    } else {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase.from("customers").select("*");

      if (error) {
        console.error("Error koneksi Supabase:", error);
      } else {
        console.log("Data dari Supabase:", data);
        setCustomers(data);
      }
      setLoading(false);
    };

    fetchCustomers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Nama</th>
            <th className="p-2">Email</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <CustomerTable
              key={index}
              id={customer.id}
              name={customer.name}
              email={customer.email}
              onDelete={handleDeleteCustomer}
            />
          ))}
        </tbody>
      </table>
      <button
        onClick={() => router.push("/admin/customers/create")}
        className="fixed bottom-10 right-6 bg-gray-300 hover:bg-gray-100 text-xl w-15 h-10 rounded flex items-center justify-center "
      >
        <IconPlus />
      </button>
    </div>
  );
}
