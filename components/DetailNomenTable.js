"use client";

import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useEffect } from "react";

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

  return state?.map((item, index) => {
    return (
      <tr
        id={item.id}
        key={`${item.id}nomen`}
        className="py-2 text-center bg-gray-50 odd:bg-gray-400 even:bg-slate-50 border-b-2 border-solid border-slate-700  "
      >
        <td className="px-1">{item.vendor}</td>
        <td className="px-1">{item.name}</td>
        <td className="px-1">{item.manname}</td>
        <td className="px-1">{item.unit}</td>
        <td className="px-1">{item.price * item.count}</td>
        <td className="px-1">{item.amount}</td>
        <td className="px-1">
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
  });
};

export default DetailNomenTable;
