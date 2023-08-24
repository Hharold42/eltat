"use client";

import Link from "next/link";
import { CSVLink } from "react-csv";

export default async function Home() {
  const csvData = [
    ["TEST", "", ""],
    ["", "", ""],
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  ];

  return (
    <main>
      <Link href="/orderCreate">Создать</Link>
      <CSVLink data={JSON.stringify(csvData)} asyncOnClick={true}>
        LOL
      </CSVLink>
    </main>
  );
}
