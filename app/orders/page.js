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
  const [currentPage, setCurrentPage] = useState(1);

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
      <div className="flex flex-row w-full justify-between [&>*]:mx-2 [&>*]:my-2">
        <SelectContactor
          handler={changeContactor}
          plus={false}
          def={contractor}
        />
        <SelectProject handler={changeProject} plus={false} def={project} />
        <div className="w-full p-4 bg-white rounded-lg shadow-md">
          <span className="block text-lg font-semibold text-gray-800 mb-2">
            Название
          </span>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="mt-2 block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 justify-center items-center align-middle"
          />
        </div>
        <div className="bg-transparent items-center w-[10%] text-center align-middle">
          <button
            className="block w-full px-4 py-2 text-white  bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200 mt-5 border-2 border-white"
            onClick={() => {
              setCurrentPage(1);
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
      </div>
      <div className="max-w-full shadow-md min-h-[10vh] bg-white rounded-md mx-2">
        <OrdersTable
          searchTerm={search}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </main>
  );
}
