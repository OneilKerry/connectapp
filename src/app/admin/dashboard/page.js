"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [subscriptions, setSubscriptions] = useState(2350); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`id, quantity, status, created_at, products ( price )`)
        .eq("status", "Selesai");

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      let revenueTotal = 0;
      const monthly = {};

      orders.forEach((order) => {
        const date = new Date(order.created_at);
        const month = date.toLocaleString("id-ID", { month: "short" });
        const price = order.products?.price || 0;
        const amount = price * order.quantity;
        revenueTotal += amount;

        if (!monthly[month]) {
          monthly[month] = 0;
        }

        monthly[month] += amount;
      });

      const formattedMonthly = Object.entries(monthly).map(([month, value]) => ({
        name: month,
        value,
      }));

      setTotalRevenue(revenueTotal);
      setMonthlyRevenue(formattedMonthly);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <section className="p-6  min-h-screen text-white space-y-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border shadow-md">
          <CardContent className="p-6">
            <p className="text-sm text-zinc-400">Total Revenue</p>
            <p className="text-3xl font-semibold mt-1 mb-1">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </p>
            <p className="text-sm text-green-500 mb-3">+20.1% dari bulan lalu</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={monthlyRevenue}>
                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <p className="text-sm text-zinc-400">Subscriptions</p>
            </div>
            <p className="text-3xl font-semibold mt-1 mb-1">+{subscriptions}</p>
            <p className="text-sm text-green-500 mb-3">+180.1% dari bulan lalu</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="orange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#f97316" fill="url(#orange)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
