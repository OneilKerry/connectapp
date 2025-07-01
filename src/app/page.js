"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState({ username: "", password: "" });

  function handleSubmit() {
    router.push("/admin/users");
  }

  return (
    <main className="flex justify-center items-center h-[100vh]">
      <div className="flex flex-col border-2 gap-3 items-center p-8 rounded-xl w-[420px]">
        <p className="text-2xl font-bold text-center">CONNECT WITH US</p>
        <Input placeholder="Masukan Email" type="Email" onChange={(e) => setData((currentData) => ({...currentData, username: e.target.value,}))}/>

        <Input className="w-[350px]" placeholder="Masukan Password" type="Password" 
        
        onChange={(e) => setData((currentData) => ({...currentData, password: e.target.value,}))}/>

        <Button className="w-[100%]" onClick={handleSubmit}>Sign in</Button>
      </div>
    </main>
  );
}
