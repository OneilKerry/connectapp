"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

export default function RiwayatPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select(`
          id,
          action,
          description,
          timestamp,
          orders (
            id,
            quantity,
            products (
              name,
              image_url
            )
          )
        `)
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Gagal mengambil activity logs:", error);
        setError("Gagal mengambil data riwayat.");
      } else {
        setLogs(data);
      }

      setLoading(false);
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <section className="p-5 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b pb-4">
            <Skeleton className="w-12 h-12 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (error) return <p className="text-red-500 p-5">{error}</p>;

  return (
    <section className="p-5">
      <h1 className="text-2xl font-bold mb-4">Riwayat Aktivitas</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Produk</th>
            <th className="p-2">Jumlah</th>
            <th className="p-2">Status</th>
            <th className="p-2">Waktu</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            const product = log.orders?.products;
            const order = log.orders;

            return (
              <tr key={log.id} className="border-b">
                <td className="p-2 flex items-center gap-2">
                  {product?.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <span>{product?.name || "Produk Tidak Diketahui"}</span>
                </td>
                <td className="p-2">{order?.quantity || "-"}</td>
                <td className="p-2">{log.description || "-"}</td>
                <td className="p-2">
                  {log.timestamp
                    ? new Date(log.timestamp).toLocaleString("id-ID")
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
