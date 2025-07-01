"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          quantity,
          status,
          created_at,
          products ( name, image_url )
        `)
        .in('status', ['Dalam Proses', 'Selesai']);
        
      if (error) {
        console.error("Gagal fetch orders:", error);
        setError("Gagal mengambil data orders.");
      } else {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="p-5">

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Produk</th>
            <th className="p-2">Jumlah</th>
            <th className="p-2">Status</th>
            <th className="p-2">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="p-2 flex items-center gap-2">
                {order.products?.image_url && (
                  <img
                    src={order.products.image_url}
                    alt={order.products.name}
                    className="w-10 h-10 object-cover"
                  />
                )}
                <span>{order.products?.name}</span>
              </td>
              <td className="p-2">{order.quantity}</td>
              <td className="p-2">{order.status}</td>
              <td className="p-2">
                {new Date(order.created_at).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
