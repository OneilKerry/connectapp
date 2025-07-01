"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    stock: 0,
    price: 0,
    image_url: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Gagal fetch product:", error);
        alert("Gagal mengambil data produk");
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "stock" || name === "price" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    let imageUrl = product.image_url;

    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Gagal upload file:", uploadError);
        alert("Gagal upload gambar baru");
        setSaving(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from("products")
      .update({
        name: product.name,
        stock: product.stock,
        price: product.price,
        image_url: imageUrl,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      console.error("Gagal update produk:", error);
      alert("Gagal menyimpan perubahan");
    } else {
      alert("Produk berhasil diupdate");
      router.push("/admin/products");
    }
  };

  if (loading) return <p>Loading data produk...</p>;

  return (
    <section>
      <h1 className="text-xl font-bold mb-4">Edit Produk</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-semibold">Nama Produk:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Stok:</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Harga:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {product.image_url && (
          <div>
            <label className="block mb-1 font-semibold">Gambar Saat Ini:</label>
            <img
              src={product.image_url}
              alt="Gambar Produk"
              className="w-60 h-40 object-cover rounded"
            />
          </div>
        )}

        <div>
          <label className="block mb-1 font-semibold">
            Gambar Baru (Opsional):
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
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
