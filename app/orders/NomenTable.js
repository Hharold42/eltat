

import fetcher from "@/utils/fetcher";
import useSWR from "swr";

const NomenTable = ({ handler }) => {
  const { data, error, isLoading } = useSWR("api/getNomenclature", fetcher);

  return (
    <div>
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
    </div>
  );
};

export default NomenTable;
