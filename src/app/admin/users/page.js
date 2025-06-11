"use client";
import UserCard from "@/components/ui/users-card";
import {
  IconLogout,
  IconLogout2,
  IconUser,
  IconUsersGroup,
  IconUsersPlus,
  IconPlus,
} from "@tabler/icons-react";
import { usersData } from "../../../../mock/userData";
import useSWR from "swr";

export default function Users() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data : users, error, isLoading } = useSWR(
    `http://jsonplaceholder.typicode.com/users/`,
    fetcher
  );
  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  console.log(users);
  return (
    <section id="container" className="flex h-screen justify-center">
      <section id="content" className="bg-white w-[85%] ">
        <input
          placeholder="Cari user"
          className="flex w-[98%] h-[5vh] mb-5 p-4 text-[14,5px] border border-gray-300 rounded-[7px]"
        />
        {users.map((user, index) => (
          <UserCard
            key={index}
            name={user.name}
            email={user.email}
            roles={user.address.city}
            status={user.company.bs}
          />
        ))}
      </section>
      <button className="absolute bottom-10 right-6 bg-gray-300 hover:bg-gray-100 text-xl w-15 h-10 rounded flex items-center justify-center ">
        <IconPlus />
      </button>
    </section>
  );
}
