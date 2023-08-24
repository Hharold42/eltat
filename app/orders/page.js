"use client";

import { useState } from "react";
import OrdersTable from "../../components/OrdersTable";
import SelectContactor from "../../components/SelectContactor";
import SelectProject from "../../components/SelectProject";

export default function Orders() {
  const [contractor, setContactor] = useState(-1);
  const [project, setProject] = useState(-1);
  const [term, setTerm] = useState("");
  const [search, setSearch] = useState({
    contractor: -1,
    project: -1,
    term: "",
  });

  const changeProject = (e) => {
    const { value } = e.target;
    setProject(value);
  };

  const changeContactor = (e) => {
    const { value } = e.target;
    setContactor(value);
  };

  return (
    <main className="flex flex-col">
      <div className="flex flex-row w-full justify-between">
        <SelectContactor handler={(e) => changeContactor(e)} plus={false} />
        <SelectProject handler={(e) => changeProject(e)} plus={false} />
        <div className="w-full p-4 bg-white rounded-lg shadow-md">
          <span className="block text-lg font-semibold text-gray-800 mb-2">
            Название
          </span>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="mt-2 block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
          />
        </div>
        <button
          onClick={() => {
            setSearch({
              contractor: contractor,
              project: project,
              term: term,
            });
          }}
        >
          Поиск
        </button>
      </div>
      <div className="w-full shadow-md min-h-[10vh] ">
        <OrdersTable searchTerm={search} />
      </div>
    </main>
  );
}
