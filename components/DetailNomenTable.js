"use client";

import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useEffect } from "react";
import rounded from "@/utils/round";

const DetailNomenTable = ({ ids, state, handler }) => {
  const { data, isLoading } = useSWR(
    `/api/getNomenclature?ids=${ids}`,
    fetcher
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    const parsedData = data?.map((item) => {
      let count = 0;
      ids.map((id) => {
        if (id === item.id) {
          count++;
        }
      });

      return { ...item, count: count };
    });
    handler(parsedData);
  }, [data]);

  if (!!isLoading)
    return (
      <tr>
        <td>Загрузка</td>
      </tr>
    );

  return (
    <tbody>
      <tr className="text-right font-bold [&>*]:pr-4">
        <td colSpan={4}>Итого: </td>
        <td>
          {state.length > 0
            ? rounded(
                state.reduce((prev, curr) => {
                  return prev + curr.price * curr.count;
                }, 0)
              )
            : 0}
        </td>
      </tr>
      {state?.map((item, index) => {
        return (
          <tr
            id={item.id}
            key={`${item.id}nomen`}
            className="hover:bg-gray-50 text-left font-medium [&>*]:px-1"
          >
            <td>{item.vendor}</td>
            <td>{item.name}</td>
            <td>{item.manname}</td>
            <td>{item.unit}</td>
            <td>{item.price * item.count}</td>
            <td>{item.amount}</td>
            <td>
              <div className="flex items-center">
                <input
                  type="number"
                  defaultValue={item.count}
                  className="mr-2 max-w-[4rem] text-center border-2 border-black rounded"
                  onChange={(e) => {
                    handler((prev) => {
                      const newArr = prev.map((item, i) => {
                        if (i === index) {
                          return { ...item, count: e.target.value };
                        }
                        return item;
                      });

                      return newArr;
                    });
                  }}
                ></input>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default DetailNomenTable;
