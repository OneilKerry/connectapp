"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { IconBrandWhatsapp, IconCancel, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        quantity,
        status,
        created_at,
        product_id,
        customers ( name ),
        products ( name, image_url, stock )
      `)
      .in('status', ['Pesanan Masuk', 'Dalam Proses']);

    if (error) {
      console.error("Error fetch orders:", error);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const confirmChange = window.confirm(
      `Apakah Anda yakin ingin mengganti status menjadi "${newStatus}"?`
    );

    if (!confirmChange) return;

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Error update status:", error);
    } else {
      fetchOrders(); 
    }
  };

  const handleDeleteOrder = async (order) => {
    const confirmDelete = window.confirm(
      `Yakin ingin membatalkan order dari ${order.customers?.name || "Tanpa Nama"}?`
    );

    if (!confirmDelete) return;

    const newStock = (order.products?.stock || 0) + order.quantity;

    const { error: stockError } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", order.product_id);

    if (stockError) {
      console.error("Gagal mengembalikan stock:", stockError);
      return;
    }

    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", order.id);

    if (deleteError) {
      console.error("Gagal hapus order:", deleteError);
    } else {
      fetchOrders(); 
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section className="p-5">
      <h1 className="text-2xl font-bold mb-4">Daftar Order</h1>

      {orders.length === 0 ? (
        <p>Belum ada order.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="border rounded p-4 mb-4 shadow-sm flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold">
                {order.customers?.name || "Tanpa Nama Customer"}
              </h2>

              {order.products?.image_url && (
                <img
                  src={order.products.image_url}
                  alt={order.products.name}
                  className="w-[100%] h-[40%] object-cover my-2"
                />
              )}

              <p>Produk: {order.products?.name || "Produk Tidak Diketahui"}</p>
              <p>Jumlah: {order.quantity}</p>
              <p>Status: {order.status}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="border rounded p-1"
              >
                <option value="Pesanan Masuk">Pesanan Masuk</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Selesai">Selesai</option>
              </select>

              <a
                href={`https://wa.me/081350719886?text=Halo%20Admin,%20saya%20${order.customers?.name}%20mau%20konfirmasi%20pembayaran%20untuk%20Order%20ID%20${order.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-3 py-1 rounded text-sm flex"
              >
                Konfirmasi via Whatsapp<IconBrandWhatsapp className="ml-2 w-5 h-5" />
              </a>

              <Button
                onClick={() => handleDeleteOrder(order)}
                className="bg-red-500"
              >
                Batalkan Order<IconCancel />
              </Button>
            </div>
          </div>
        ))
      )}

      <button
        onClick={() => router.push("/admin/orders/create")}
        className="absolute bottom-10 right-6 bg-gray-300 hover:bg-gray-100 text-xl w-15 h-10 rounded flex items-center justify-center"
      >
        <IconPlus />
      </button>
    </section>
  );
}
