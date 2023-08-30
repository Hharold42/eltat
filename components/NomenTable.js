import fetcher from "@/utils/fetcher";
import { useState } from "react";
import useSWR from "swr";
import { AiOutlinePlus } from "react-icons/ai";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
} from "feather-icons-react/build/IconComponents";

const NomenTable = ({ handler }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const { data, error, isLoading } = useSWR(
    `/api/getNomenclature?page=${currentPage}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md fixed right-4 min-w-[49%] max-w-[49%]">
        <span className="block text-lg font-semibold text-gray-800 mb-2">
          Номенклатура
        </span>
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md fixed right-4 w-[49%] h-[90vh]">
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
            onClick={(e) => {
              setCurrentPage(1);
              setSearchTerm(search);
            }}
            className="ml-2 px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Искать
          </button>
        </div>
      </div>
      <div className="">
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
            {data?.map((item) => (
              <tr
                key={`${item.id}nomen`}
                className="py-2 text-center bg-gray-50 odd:bg-gray-400 even:bg-slate-50 border-b-2 border-solid border-slate-700"
              >
                <td className="px-1 ">
                  <button
                    onClick={(e) => {
                      handler(item);
                    }}
                    className="bg-indigo-800 text-white rounded-md p-2"
                  >
                    <AiOutlinePlus size={30} />
                  </button>
                </td>
                <td className="px-1 ">{item.vendor}</td>
                <td className="px-1 ">{item.name}</td>
                <td className="px-1 ">{item.manname}</td>
                <td className="px-1 ">{item.unit}</td>
                <td className="px-1 ">{item.price}</td>
                <td className="px-1 ">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between fixed bottom-4">
        <button
          className="px-4 py-2 mx-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
          disabled={currentPage === 1}
        >
          <ArrowLeftCircle />
        </button>
        <button
          className="px-4 py-2 mx-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          <ArrowRightCircle />
        </button>
      </div>
    </div>
  );
};

export default NomenTable;
