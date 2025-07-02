"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Gagal fetch products:", error);
      } else {
        console.log("Data produk dari Supabase:", data);
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Apakah yakin ingin menghapus produk ini?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Gagal delete:", error);
      alert("Gagal menghapus produk");
    } else {
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      console.log("Produk berhasil dihapus");
    }
  };

  return (
    <section id="container" className="flex justify-center">
      <section id="content" className="bg-white w-[85%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          // SKELETON loading untuk 6 item
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded p-4 shadow-sm flex flex-col">
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-[140px] w-full rounded mb-2" />
              <Skeleton className="h-4 w-1/3 mb-1" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded" />
                <Skeleton className="h-8 w-20 rounded" />
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <p>Belum ada data produk.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="border rounded p-4 shadow-sm flex flex-col">
              <h2 className="font-bold text-lg">{product.name}</h2>

              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-[140px] object-cover rounded mt-2"
                />
              )}

              <p>Stok: {product.stock}</p>
              <p>Harga: Rp {product.price}</p>

              <div className="mt-3 flex gap-2">
                <Button
                  onClick={() => router.push(`/admin/products/update/${product.id}`)}
                  className="bg-blue-500"
                >
                  Edit <IconEdit className="ml-1" />
                </Button>

                <Button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500"
                >
                  Delete <IconTrash className="ml-1" />
                </Button>
              </div>
            </div>
          ))
        )}
      </section>

      <button
        onClick={() => router.push("/admin/products/create")}
        className="fixed bottom-10 right-6 bg-gray-300 hover:bg-gray-100 text-xl w-15 h-10 rounded flex items-center justify-center"
      >
        <IconPlus />
      </button>
    </section>
  );
}
