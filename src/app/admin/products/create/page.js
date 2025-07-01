"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

export default function CreateProduct() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let imageUrl = "";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, imageFile);

      if (uploadError) {
        setError("Gagal upload gambar: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);

      imageUrl = data.publicUrl;
    }
    const { error: insertError } = await supabase.from("products").insert([
      {
        name: name,
        image_url: imageUrl,
        stock: Number(stock),
        price: Number(price),
      },
    ]);

    setLoading(false);

    if (insertError) {
      console.error("Gagal menambahkan produk:", insertError);
      setError("Gagal menambahkan produk.");
    } else {
      router.push("/admin/products");
    }
  };

  return (
    <section className="p-5">
      <h1 className="text-2xl font-bold mb-4">Tambah Produk Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Nama Produk:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div>
          <label>Upload Gambar Produk:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div>
          <label>Stok Produk:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>

        <div>
          <label>Harga Produk (Rp):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Produk"}
          </Button>

          <Button type="button" onClick={() => router.back()}>
            <IconArrowLeft />
            Kembali
          </Button>
        </div>
      </form>
    </section>
  );
}
