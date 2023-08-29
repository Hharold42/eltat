"use client";

import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import ContractorById from "./ContractorData";
import TeamByIds from "./TeamData";
import ProjectById from "./ProjectData";
import Link from "next/link";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
} from "feather-icons-react/build/IconComponents";
import { ImCheckmark } from "react-icons/im";

export default function OrdersTable({
  searchTerm,
  currentPage,
  setCurrentPage,
}) {
  const pageSize = 10;
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
    <div className="p-4">
      <table className="min-w-full border-collapse border border-gray-300 [&>*>tr>*]:border">
        <thead>
          <tr key={"zerotbl"} className="bg-[#000480] text-white text-left">
            <th className="p-2">№</th>
            <th className="p-2">Контрагент</th>
            <th className="p-2">Проект</th>
            <th className="p-2">Имя</th>
            <th className="p-2">Комманда</th>
            <th className="p-2">Дата создания</th>
            <th className="p-2">Себестоимость</th>
            <th className="p-2">Цена</th>
            <th className="p-2">Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-right font-bold">
            <td colSpan={6} className="">
              Итого:
            </td>
            <td>
              {rows.reduce((prev, curr) => {
                return (prev += curr.cost ? parseFloat(curr.cost) : 0);
              }, 0)}
            </td>
            <td>
              {rows.reduce((prev, curr) => {
                return (prev += curr.cost
                  ? parseFloat(curr.cost) * (1 + parseFloat(curr.margin) / 100)
                  : 0);
              }, 0)}
            </td>
          </tr>
          {rows?.map((item) => (
            <tr
              key={item.id + "order"}
              className="hover:bg-gray-50 text-center font-medium"
            >
              <td className="p-2">{item.id}</td>
              <ContractorById id={item.contractorId} cn={"p-2"} />
              <ProjectById id={item.projectId_} cn={"p-2"} />
              <td className="p-2">
                <Link
                  href={`/orders/${item.id}`}
                  className="text-indigo-400 hover:border-b hover:border-indigo-800"
                >
                  {item.name}
                </Link>
              </td>
              <TeamByIds ids={item.teamIds} cn={"p-2"} />
              <td className="p-2">
                {new Date(item.createdAt).toLocaleDateString("ru")}
              </td>
              <td className="p-2">{item.cost ? item.cost : 0}</td>
              <td className="p-2">
                {item.cost
                  ? parseFloat(item.cost) * (1 + parseFloat(item.margin) / 100)
                  : 0}
              </td>
              <td className="p-2">{item.completed ? <ImCheckmark /> : <></>}</td>
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
          } rounded-md  focus:outline-none focus:ring focus:ring-indigo-200 my-2`}
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
          } rounded-md  focus:outline-none focus:ring focus:ring-indigo-200 my-2`}
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
