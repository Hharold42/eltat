"use client";

import { useEffect, useState } from "react";
import OrdersTable from "../../components/OrdersTable";
import SelectContactor from "../../components/SelectContactor";
import SelectProject from "../../components/SelectProject";
import { FiSearch } from "react-icons/fi";
import SubHeader from "@/components/orders/SubHeader";
import { FaArrowUp } from "react-icons/fa";
import { AiOutlineReload } from "react-icons/ai";

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
  const [showTopBtn, setShowTopBtn] = useState(false);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);

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
            full={true}
          />
          <SelectProject
            handler={changeProject}
            plus={false}
            def={project}
            full={true}
          />
          <div className="flex items-center mr-4">
            <span className="text-black font-semibold pr-2 w-[120px] max-w-[120px]">
              Номер
            </span>
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setCurrentPage(1);
                  setSearch({
                    contractor: contractor,
                    project: project,
                    term: term,
                  });
                  setMutated(true);
                }
              }}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder=""
              className="w-full
               border border-black border-solid rounded-sm px-2 py-1 focus:outline-none"
            />
            <button
              className="flex items-center justify-center border border-black mx-2 rounded-sm bg-gradient-to-t from-[#fbfbfb] via-[#e0e0e0] to-[#fbfbfb]"
              onClick={() => {
                setCurrentPage(1);
                setSearch({
                  contractor: contractor,
                  project: project,
                  term: term,
                });
                setMutated(true);
              }}
            >
              <FiSearch size={30} />
            </button>
            <button
              className="flex items-center justify-center border border-black mx-2 rounded-sm bg-gradient-to-t from-[#fbfbfb] via-[#e0e0e0] to-[#fbfbfb]"
              onClick={() => {
                setCurrentPage(1);
                setContactor(-1);
                setProject(-1);
                setTerm("");
                setSearch({
                  contractor: -1,
                  project: -1,
                  term: "",
                });
                setMutated(true);
              }}
            >
              <AiOutlineReload size={30} />
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
      <button
        className="sticky bottom-5 mx-5 z-30 p-4 rounded-full bg-slate-500 opacity-70"
        onClick={goToTop}
      >
        <FaArrowUp color="white" className="text-xl " />
      </button>
    </div>
  );
}
