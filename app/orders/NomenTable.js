import fetcher from "@/utils/fetcher";
import { useState } from "react";
import useSWR from "swr";

const NomenTable = ({ handler }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const { data, error, isLoading } = useSWR(
    `api/getNomenclature?page=${currentPage}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
    fetcher
  );
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div>
        <span>Поиск</span>
        <input
          type="text"
          value={search}
          placeholder="Артикул, название, производитель"
          onChange={(e) => {
            e.preventDefault();

            setSearch(e.target.value);
          }}
        />
        <button onClick={(e) => setSearchTerm(search)}>Искать</button>
      </div>
      <table>
        <thead>
          <tr key={"zeronomen"}>
            <th>+</th>
            <th>Артикул</th>
            <th>Наименование</th>
            <th>Производитель</th>
            <th>Ед.</th>
            <th>Цена</th>
            <th>Кол-во в упаковке</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td>+</td>
              <td>Загрузка</td>
              <td>Загрузка</td>
              <td>Загрузка</td>
              <td>Загрузка</td>
              <td>Загрузка</td>
              <td>Загрузка</td>
            </tr>
          ) : (
            data?.map((item) => (
              <tr key={`${item.id}nomen`}>
                <td>
                  <button
                    onClick={(e) => {
                      handler(item);
                    }}
                  >
                    +
                  </button>
                </td>
                <td>{item.vendor}</td>
                <td>{item.name}</td>
                <td>{item.manname}</td>
                <td>{item.unit}</td>
                <td>{item.price}</td>
                <td>{item.amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div>
        <button
          className="cursor-pointer"
          onClick={() => {
            console.log("click");
            setCurrentPage((prev) => prev - 1);
          }}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        <button
          className="cursor-pointer"
          onClick={() => {
            console.log("click");
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
