"use client";

import Link from "next/link";
import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
  const { data, error, isLoading } = useSWR(`/api/getPerformers`, fetcher);
  console.log(data);

  return (
    <main>
      <Link href="./orders">Создать</Link>
    </main>
  );
}
