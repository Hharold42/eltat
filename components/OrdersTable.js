"use client";

import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import ContractorById from "./ContractorData";
import ProjectById from "./ProjectData";
import Link from "next/link";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
} from "feather-icons-react/build/IconComponents";
import rounded from "@/utils/round";
import { saveAs } from "file-saver";
import PaginationButton from "./client/Pagination";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersTable({
  searchTerm,
  currentPage,
  setCurrentPage,
  checker,
  checked,
  setter,
  isMutated,
  mutator,
}) {
  const [pageSize, setPageSize] = useState(100);

  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios
        .get(
          `/api/getOrders?page=${currentPage}&pageSize=${pageSize}&searchTerm=${searchTerm.term}&searchProj=${searchTerm.project}&searchContr=${searchTerm.contractor}`
        )
        .then((data) => {
          setRows(data.data.data);
          setTotalPages(Math.ceil(data.data.totalItems / pageSize));
        });
    };

    if (isMutated) {
      fetchData();

      mutator(false);
    }
  }, [isMutated]);

  return (
    <div className="font-bold px-1 text-sm overflow-x-scroll">
      <div className="">
        <div className="flex justify-between"></div>
        <PaginationButton
          curPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          mutator={mutator}
        />
      </div>

      <div className="my-2 border-b border-indigo-600">
        <span>Кол-во записей: </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(() => e.target.value);
            mutator(true);
          }}
        >
          <option value={100}>100</option>
          <option value={50}>50</option>
          <option value={30}>30</option>
          <option value={10}>10</option>
        </select>
      </div>

      <table className="min-w-full border-collapse border border-gray-300 [&>*>tr>*]:border text-sm">
        <thead className="">
          <tr
            key={"zerotbl"}
            className="bg-[#000480] text-white text-left [&>*]:px-2 [&>*]:py-1 "
          >
            <th className="flex flex-col align-middle h-full border-none">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked === true) {
                    setter(rows.map((row) => row.id));
                  } else {
                    setter([]);
                  }
                }}
              ></input>
            </th>
            <th>№</th>
            <th>Контрагент</th>
            <th>Проект</th>
            <th>Название</th>
            <th>Создано</th>
            <th>Себестоимость</th>
            <th>Наценка</th>
            <th>Цена</th>
            <th>Счета</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-right font-bold [&>*]:pr-4">
            <td colSpan={6} className="">
              Итого:
            </td>
            <td>
              {rows
                .reduce((prev, curr) => {
                  return rounded(
                    (prev += curr.cost ? parseFloat(curr.cost) : 0)
                  );
                }, 0)
                .toLocaleString("en-EU")}
            </td>
            <td className="text-left px-2">
              {rows
                .reduce((prev, curr) => {
                  return rounded(
                    (prev += curr.cost
                      ? parseFloat(curr.cost) * (parseFloat(curr.margin) / 100)
                      : 0)
                  );
                }, 0)
                .toLocaleString("en-EU")}
            </td>
            <td className="text-left px-2">
              {rows
                .reduce((prev, curr) => {
                  return rounded(
                    (prev += curr.cost
                      ? parseFloat(curr.cost) *
                        (1 + parseFloat(curr.margin) / 100)
                      : 0)
                  );
                }, 0)
                .toLocaleString("en-EU")}
            </td>
          </tr>
          {rows?.map((item) => (
            <tr
              key={item.id + "order"}
              className="hover:bg-gray-50 text-left font-medium [&>*]:px-2"
            >
              <td className=" align-middle text-center">
                <input
                  type="checkbox"
                  checked={checked.includes(item.id)}
                  onChange={(e) => checker(item.id, e.target.checked)}
                ></input>
              </td>
              <td>{item.id}</td>
              <ContractorById id={item.contractorId} cn={"p-2"} />
              <ProjectById id={item.projectId_} cn={"p-2"} />
              <td>
                <Link
                  href={`/orders/${item.id}`}
                  className="text-indigo-400 hover:border-b hover:border-indigo-800"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-gray-400">{item.comment}</p>
              </td>
              <td>{new Date(item.createdAt).toLocaleDateString("ru")}</td>
              <td>
                {item.cost ? Number(item.cost).toLocaleString("en-EU") : 0}
              </td>
              <td>{`${item.margin}%`}</td>
              <td>
                {item.cost
                  ? rounded(
                      parseFloat(item.cost) *
                        (1 + parseFloat(item.margin) / 100)
                    ).toLocaleString("en-EU")
                  : 0}
              </td>
              <td className="max-w-[100px]">
                <div>
                  {item.files
                    .map((file, index) => {
                      const downloadFile = () => {
                        // Ensure that the order.files object has the expected structure
                        if (file) {
                          // Convert the data array to a Uint8Array
                          const uint8Array = new Uint8Array(file.data);

                          // Create a Blob from the Uint8Array
                          const blob = new Blob([uint8Array], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                          });

                          // Use FileSaver.js to trigger the download
                          saveAs(blob, `order_${item.id}${index}.xlsx`);
                        } else {
                          console.error("Invalid order.files object format");
                          // Handle the error or provide a message to the user
                        }
                      };

                      return (
                        <button onClick={downloadFile} className="mr-1 text-xs">
                          {item.id}
                          {index}
                          {index > 0 ? "," : ""}
                        </button>
                      );
                    })
                    .reverse()}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="">
        <div className="flex justify-between">
          <button
            className={`px-4 py-2 text-white ${
              currentPage === 1
                ? "bg-gray-400"
                : "bg-indigo-500 hover:bg-indigo-600"
            } rounded-sm  focus:outline-none focus:ring focus:ring-indigo-200 my-2`}
            onClick={() => {
              setCurrentPage((prev) => prev - 1);
              mutator(true);
            }}
            disabled={currentPage === 1}
          >
            <ArrowLeftCircle />
          </button>
          <button
            className={`px-4 py-2 text-white ${
              currentPage === totalPages
                ? "bg-gray-400"
                : "bg-indigo-500 hover:bg-indigo-600"
            } rounded-sm  focus:outline-none focus:ring focus:ring-indigo-200 my-2`}
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
              mutator(true);
            }}
            disabled={currentPage === totalPages}
          >
            <ArrowRightCircle />
          </button>
        </div>
        <PaginationButton
          curPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          mutator={mutator}
        />
      </div>
    </div>
  );
}
