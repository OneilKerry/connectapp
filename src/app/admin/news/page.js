"use client";

import useSWR from "swr";

export default function PageNews(){
    const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data : post, error, isLoading } = useSWR(
    `http://jsonplaceholder.typicode.com/posts/`,
    fetcher
  );
  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

    return (
        <div>
            {post.map((post, index) => ( 
                <div className="border-2 p-10 rounded-lg" key={index}>
                <p className="text-base font-bold text-[20px] font-sans ">{post.title}</p>
                <p>{post.body}</p>
            </div>
            ))}
            
        </div>
    )
}