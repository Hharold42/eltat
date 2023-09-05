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
  const [isMuteted, setMutated] = useState(true);

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

  const uncheck = (id) => {
    setChecked((prev) => {
      const index = prev.indexOf(id);
      const tmp = [...prev];

      if (index > -1) {
        tmp.splice(index, 1);
      }

      return tmp;
    });
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
      <SubHeader
        checkedOrders={checked}
        mutator={setMutated}
        checker={uncheck}
      />
      <main className="flex flex-col my-2 w-full">
        <div className="flex flex-row justify-center mx-4 [&>*]:mx-2">
          <SelectContactor
            handler={changeContactor}
            plus={false}
            def={contractor}
          />
          <SelectProject handler={changeProject} plus={false} def={project} />
          <div className="flex items-center mr-4">
            <span className="text-black font-semibold pr-2 w-[120px] max-w-[120px]">
              Номер
            </span>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder=""
              className="w-[150px]
               border border-black border-solid rounded-sm px-2 py-1 focus:outline-none"
            />
            <button
              className="flex items-center justify-center border rounded-sm ml-[-2rem] bg-gradient-to-t from-[#fbfbfb] via-[#e0e0e0] to-[#fbfbfb]"
              onClick={() => {
                setCurrentPage(1);
                setSearch({
                  contractor: contractor,
                  project: project,
                  term: term,
                });
              }}
            >
              <FiSearch size={30} />
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
            isMutated={isMuteted}
            mutator={setMutated}
          />
        </div>
      </main>
    </div>
  );
}
