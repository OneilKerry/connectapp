"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

export default function CreateCustomer() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.from("customers").insert([
      { name: name, phone_number: phone, email: email },
    ]);

    setLoading(false);

    if (error) {
      console.error("Gagal tambah customer:", error);
      setError("Gagal menambahkan customer.");
    } else {
      router.push("/admin/customers");  // Redirect ke halaman daftar customer
    }
  };

  return (
    <section className="p-5">
      <h1 className="text-2xl font-bold mb-4">Tambah Customer Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Nama:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded w-full p-2"
            required
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

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        <div className="flex gap-3">
          <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>

        <Button
            type="button"
            onClick={() => router.back()}
          >
            <IconArrowLeft  />Kembali
          </Button>
        </div>
        
      </form>
    </section>
  );
}
