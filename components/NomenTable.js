import fetcher from "@/utils/fetcher";
import { useState } from "react";
import useSWR from "swr";
import { AiOutlinePlus } from "react-icons/ai";
import PaginationButton from "./client/Pagination";

const NomenTable = ({ handler }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 100;

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

  const pages = Math.ceil(data?.totalPages / pageSize);
  return (
    <div className="z-0 bg-[#F8F8F1] h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 py-2">
        <div>
          <PaginationButton
            curPage={currentPage}
            totalPages={pages}
            setCurrentPage={setCurrentPage}
          />
        </div>

        <div className="flex flex-row">
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
      <div className="font-bold text-lg px-1 overflow-y-scroll max-h-[80vh] border">
        <table className="min-w-full border-collapse border border-gray-300 [&>*>tr>*]:border text-sm">
          <thead>
            <tr
              key="zeronomen"
              className="[&>*]:p-2 bg-[#000480] text-white text-left sticky top-0"
            >
              <th>
                
              </th>
              <th>Артикул</th>
              <th>Наименование</th>
              <th>Производитель</th>
              <th>Ед.</th>
              <th>Цена</th>
              <th>Кол-во в упаковке</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((item) => (
              <tr
                key={`${item.id}nomen`}
                className="hover:bg-gray-50 text-left font-medium [&>*]:p-2"
              >
                <td className="flex justify-center">
                  <button
                    onClick={(e) => {
                      handler(item);
                    }}
                    className="bg-indigo-800 text-white rounded-md"
                  >
                    <AiOutlinePlus size={30} />
                  </button>
                </td>
                <td>{item.vendor}</td>
                <td>{item.name}</td>
                <td>{item.manname}</td>
                <td>{item.unit}</td>
                <td>{item.price}</td>
                <td>{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NomenTable;
