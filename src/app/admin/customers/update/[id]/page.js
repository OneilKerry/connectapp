"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

export default function EditCustomer() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Gagal fetch customer:", error);
      } else {
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone_number);
      }
      setLoading(false);
    };

    fetchCustomer();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("customers")
      .update({ name, email, phone_number: phone })
      .eq("id", id);

    if (error) {
      console.error("Gagal update customer:", error);
    } else {
      router.push("/admin/customers");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section className="p-5">
      <h1 className="text-2xl font-bold mb-4">Edit Customer</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label>Nama:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>

        <div>
          <label>No HP:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>

      <div className="flex gap-3">
        <Button type="submit" className="text-white py-2 rounded ">
          Simpan Perubahan
        </Button>
        
        <Button
            type="button"
            onClick={() => router.back()}
          >
            <IconArrowLeft/>Kembali
          </Button>
      </div>
        
      </form>
    </section>
  );
}
