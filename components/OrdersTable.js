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
import { ImCheckmark } from "react-icons/im";
import rounded from "@/utils/round";

export default function OrdersTable({
  searchTerm,
  currentPage,
  setCurrentPage,
  checker,
  checked,
  setter,
}) {
  const pageSize = 100;
  const { data, error, isLoading } = useSWR(
    `api/getOrders?page=${currentPage}&pageSize=${pageSize}&searchTerm=${searchTerm.term}&searchProj=${searchTerm.project}&searchContr=${searchTerm.contractor}`,
    fetcher
  );

  if (isLoading) {
    return <div>loading</div>;
  }

  const rows = [...data.data];
  const totalPages = Math.ceil(data.totalItems / pageSize);

  return (
    <div className="font-bold px-1 text-sm">
      <table className="min-w-full border-collapse border border-gray-300 [&>*>tr>*]:border text-sm">
        <thead>
          <tr
            key={"zerotbl"}
            className="bg-[#000480] text-white text-left [&>*]:px-2 [&>*]:py-1"
          >
            <th>
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
          </tr>
        </thead>
        <tbody>
          <tr className="text-right font-bold [&>*]:pr-4">
            <td colSpan={6} className="">
              Итого:
            </td>
            <td>
              {rows.reduce((prev, curr) => {
                return rounded((prev += curr.cost ? parseFloat(curr.cost) : 0));
              }, 0).toLocaleString('en-EU')}
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
              <td className="flex justify-center">
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
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between">
        <button
          className={`px-4 py-2 text-white ${
            currentPage === totalPages
              ? "bg-gray-400"
              : "bg-indigo-500 hover:bg-indigo-600"
          } rounded-sm  focus:outline-none focus:ring focus:ring-indigo-200 my-2`}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
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
          }}
          disabled={currentPage === totalPages}
        >
          <ArrowRightCircle />
        </button>
      </div>
    </div>
  );
}
