"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { IconBrandWhatsapp, IconCancel, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
      .in("status", ["Pesanan Masuk", "Dalam Proses"]);

    if (error) {
      console.error("Gagal fetch orders:", error);
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

    if (!error) {
      await supabase.from("activity_logs").insert({
        order_id: orderId,
        action: "update_status",
        description: `Mengubah status order menjadi "${newStatus}"`,
      });
      fetchOrders();
    } else {
      console.error("Gagal update status:", error);
    }
  };

  const handleCancelOrder = async (order) => {
    const confirmCancel = window.confirm(
      `Yakin ingin membatalkan order dari ${order.customers?.name || "Tanpa Nama"}?`
    );
    if (!confirmCancel) return;

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "Dibatalkan" })
      .eq("id", order.id);

    if (updateError) {
      console.error("Gagal membatalkan order:", updateError);
      return;
    }

    const newStock = (order.products?.stock || 0) + order.quantity;
    const { error: stockError } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", order.product_id);

    if (stockError) {
      console.error("Gagal mengembalikan stok:", stockError);
    }

    await supabase.from("activity_logs").insert({
      order_id: order.id,
      action: "cancel",
      description: `Membatalkan order produk ${order.products?.name || "Tidak diketahui"} sebanyak ${order.quantity}`,
    });

    fetchOrders();
  };

  if (loading) {
    return (
      <section className="p-5 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="border rounded p-4 shadow-sm flex justify-between items-center"
          >
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-40 w-full rounded" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="flex flex-col items-end gap-2 w-36">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="p-5">
      <h1 className="text-2xl font-bold mb-4">Daftar Order Aktif</h1>

      {orders.length === 0 ? (
        <p>Tidak ada order aktif saat ini.</p>
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
                  className="w-full h-40 object-cover my-2"
                />
              )}

              <p>Produk: {order.products?.name || "Tidak diketahui"}</p>
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
                className="bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center"
              >
                Konfirmasi via Whatsapp
                <IconBrandWhatsapp className="ml-2 w-5 h-5" />
              </a>

              <Button
                onClick={() => handleCancelOrder(order)}
                className="bg-red-500 text-white"
              >
                Batalkan Order
                <IconCancel className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        ))
      )}

      <button
        onClick={() => router.push("/admin/orders/create")}
        className="fixed bottom-10 right-6 bg-gray-300 hover:bg-gray-100 text-xl w-15 h-10 rounded flex items-center justify-center "
      >
        <IconPlus />
      </button>
    </section>
  );
}
