"use client";

import { Button } from "@/components/ui/button";
import { navdata } from "../../../mock/navdata";
import { useRouter } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";

export default function AdminLayout({ children }) {
  const router = useRouter();

  return (
    <section id="container" className="flex h-screen justify-center">
      <section
        id="navigation"
        className="bg-white w-[15%] border-r border-gray-300 p-4"
      >
        <h1 className="text-[30px] mb-5 font-sans font-bold text-center">
          Connect
        </h1>

        <div className="nav-buttons flex flex-col items-center gap-4 p-2 w-full mb-2 font-bold text-[18px]">
          {navdata.map((user, index) => (
            <Button
              key={index}
              onClick={() => router.push(user.path)}
              className="rounded-[10px] flex items-center gap-2 py-2 px-3 text-white cursor-pointer w-[90%]"
            >
              <user.icon size={20} />
              {user.item}
            </Button>
          ))}
        </div>
      </section>

      <section id="content" className="bg-white w-[85%] p-5">
        {children}
      </section>

      <button className="absolute bottom-10 right-6 bg-gray-300 hover:bg-gray-100 text-xl w-15 h-10 rounded flex items-center justify-center">
        <IconPlus />
      </button>
    </section>
  );
}
