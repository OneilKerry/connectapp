"use client";

import { Button } from "@/components/ui/button";
import { navdata } from "../../../mock/navdata";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

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
          {navdata.map((user, index) => {
            const isActive = pathname === user.path;

            return (
              <Button
                key={index}
                onClick={() => router.push(user.path)}
                className={`rounded-[10px] flex items-center gap-2 py-2 px-3 cursor-pointer w-[90%] transition-colors duration-200 ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                <user.icon size={20} />
                {user.item}
              </Button>
            );
          })}
        </div>
      </section>


      <section id="content" className="bg-white w-[85%] p-5 overflow-y-auto">
        {children}
      </section>
    </section>
  );
}
