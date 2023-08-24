import fetcher from "@/utils/fetcher";
import { useState } from "react";
import useSWR from "swr";
import { AiOutlinePlus } from "react-icons/ai";

const NomenTable = ({ handler }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const { data, error, isLoading } = useSWR(
    `/api/getNomenclature?page=${currentPage}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
    fetcher
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-md fixed right-4 max-w-[49%]">
      <div className="mb-4">
        <span className="block text-lg font-semibold text-gray-800">Поиск</span>
        <div className="flex items-center mt-2">
          <input
            type="text"
            value={search}
            placeholder="Артикул, название, производитель"
            onChange={(e) => {
              e.preventDefault();
              setSearch(e.target.value);
            }}
            className="p-2 border rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
          />
          <button
            onClick={(e) => setSearchTerm(search)}
            className="ml-2 px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Искать
          </button>
        </div>
      </div>
      <table className="w-full mb-4">
        <thead>
          <tr key="zeronomen">
            <th className="px-1 py-2"></th>
            <th className="px-1 py-2">Артикул</th>
            <th className="px-1 py-2">Наименование</th>
            <th className="px-1 py-2">Производитель</th>
            <th className="px-1 py-2">Ед.</th>
            <th className="px-1 py-2">Цена</th>
            <th className="px-1 py-2">Кол-во в упаковке</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td className="px-1">+</td>
              <td className="px-1 ">Загрузка</td>
              <td className="px-1 ">Загрузка</td>
              <td className="px-1 ">Загрузка</td>
              <td className="px-1 ">Загрузка</td>
              <td className="px-1 ">Загрузка</td>
              <td className="px-1 ">Загрузка</td>
            </tr>
          ) : (
            data?.map((item) => (
              <tr
                key={`${item.id}nomen`}
                className="py-2 text-center bg-gray-50 odd:bg-gray-400 even:bg-slate-50 border-b-2 border-solid border-slate-700"
              >
                <td className="px-1 ">
                  <button
                    onClick={(e) => {
                      handler(item);
                    }}
                    className=" bg-indigo-800 text-white rounded-md p-2"
                  >
                    <AiOutlinePlus size={40} />
                  </button>
                </td>
                <td className="px-1 ">{item.vendor}</td>
                <td className="px-1 ">{item.name}</td>
                <td className="px-1 ">{item.manname}</td>
                <td className="px-1 ">{item.unit}</td>
                <td className="px-1 ">{item.price}</td>
                <td className="px-1 ">{item.amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex justify-between">
        <button
          className="px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        <button
          className="px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default NomenTable;
