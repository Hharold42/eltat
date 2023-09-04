"use client";

import useSWR from "swr";
import a_fetcher from "@/utils/aFetcher";
import { useState } from "react";
import rounded from "@/utils/round";

const OrdersFromIds = ({ id, amountSetter, amount }) => {
  const { data, isLoading } = useSWR(`/api/getOrders?detail=${id}`, a_fetcher);

  if (isLoading) {
    return <tr>Загрузка</tr>;
  }

  return (
    <tr
      key={`${id}-ol`}
      className="hover:bg-gray-50 text-left font-medium [&>*]:px-2"
    >
      <td>{data.id}</td>
      <td>{data.name}</td>
      <td>{data.projectName}</td>
      <td>{rounded(Number(data.cost)).toLocaleString("en-EU")}</td>
      <td>{data.margin}</td>
      <td>
        <input
          type="number"
          value={amount[id]}
          onChange={(e) => {
            amountSetter((prev) => {
              const newArr = { ...prev, [id]: parseInt(e.target.value, 10) };
              return newArr;
            });
          }}
        />
      </td>
      <td>
        {rounded(
          data.cost * (1 + data.margin / 100) * amount[id]
        ).toLocaleString("en-EU")}
      </td>
    </tr>
  );
};

export default OrdersFromIds;
