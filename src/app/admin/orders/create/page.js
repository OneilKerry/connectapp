"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateOrder() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, image_url, stock");

      if (error) {
        console.error("Gagal fetch products:", error);
      } else {
        setProducts(data);
      }
      setLoadingProducts(false);
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const selectedProduct = products.find((p) => p.id === selectedProductId);

    if (!selectedProductId || !selectedProduct || quantity < 1) {
      setError("Input tidak valid.");
      setLoading(false);
      return;
    }

    if (quantity > selectedProduct.stock) {
      setError(`Stok tidak mencukupi. Stok saat ini: ${selectedProduct.stock}`);
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("orders").insert([
      {
        product_id: selectedProductId,
        quantity: quantity,
      },
    ]);

    if (insertError) {
      console.error("Gagal simpan order:", insertError);
      setError("Gagal menyimpan pesanan.");
      setLoading(false);
      return;
    }

    const newStock = selectedProduct.stock - quantity;

    const { error: stockError } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", selectedProductId);

    if (stockError) {
      console.error("Gagal update stock:", stockError);
      setError("Order berhasil tapi gagal update stok.");
    } else {
      router.push("/admin/orders");
    }

    setLoading(false);
  };

  return (
    <section className="p-5">
      <h1 className="text-2xl font-bold mb-4">Buat Pesanan Baru</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 gap-4 mb-4">
        {loadingProducts
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="p-3 border rounded bg-gray-100">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-16 w-full rounded" />
              </div>
            ))
          : products.map((product) => {
              const isOutOfStock = product.stock <= 0;

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    if (!isOutOfStock) setSelectedProductId(product.id);
                  }}
                  disabled={isOutOfStock}
                  className={`p-3 border rounded ${
                    selectedProductId === product.id
                      ? "bg-blue-200"
                      : "bg-gray-100"
                  } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <p>{product.name}</p>
                  <p>Stok: {product.stock}</p>
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-16 object-cover"
                    />
                  )}
                  {isOutOfStock && (
                    <p className="text-red-500 text-sm mt-1">Stok Habis</p>
                  )}
                </button>
              );
            })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label>Jumlah:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded w-full p-2"
            min={1}
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Pesanan"}
          </Button>
          <Button type="button" onClick={() => router.back()}>
            <IconArrowLeft className="mr-1" />
            Kembali
          </Button>
        </div>
      </form>
    </section>
  );
}
