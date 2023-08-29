"use client";

import XLSXButton from "@/components/XLSXButton";
import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <Link href="/orderCreate">Создать</Link>
      <XLSXButton />
    </main>
  );
}
