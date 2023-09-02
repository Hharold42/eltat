"use client";

import { useState } from "react";
import OrdersTable from "../../components/OrdersTable";
import SelectContactor from "../../components/SelectContactor";
import SelectProject from "../../components/SelectProject";
import { FiSearch } from "react-icons/fi";
import SubHeader from "@/components/orders/SubHeader";

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
  const [checked, setChecked] = useState([]);

  const changeChecked = (id, checked) => {
    if (checked === true) {
      setChecked((prev) => [...prev, id]);
    } else {
      setChecked((prev) => {
        const index = prev.indexOf(id);
        const tmp = [...prev];

        if (index > -1) {
          tmp.splice(index, 1);
        }

        return tmp;
      });
    }
  };

  const changeProject = (e) => {
    const { value } = e.target;
    setProject(value);
  };

  const changeContactor = (e) => {
    const { value } = e.target;
    setContactor(value);
  };

  return (
    <div>
      <SubHeader checkedOrders={checked} />
      <main className="flex flex-col my-2">
        <div className="flex flex-row w-full justify-between mb-2 px-2">
          <SelectContactor
            handler={changeContactor}
            plus={false}
            def={contractor}
          />
          <SelectProject handler={changeProject} plus={false} def={project} />
          <div className="w-full px-2 py-1 flex flex-col">
            <span className="py-1 text-black font-semibold">Название</span>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="border border-black border-solid rounded-sm"
            />
          </div>
          <div className="flex flex-col justify-center px-2">
            <button
              className=""
              onClick={() => {
                setCurrentPage(1);
                setSearch({
                  contractor: contractor,
                  project: project,
                  term: term,
                });
              }}
            >
              <FiSearch size={40} />
            </button>
          </div>
        </div>
        <div className="bg-white p-2 border border-slate-500 m-1">
          <OrdersTable
            searchTerm={search}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            checker={changeChecked}
            checked={checked}
            setter={setChecked}
          />
        </div>
      </main>
      
    </div>
  );
}
