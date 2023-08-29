"use client";

import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import OrderDetailView from "@/components/OrderDetailView";

const DetailOrder = ({ params: { id } }) => {
  const { data, error } = useSWR(`/api/getOrders?detail=${id}`, fetcher);

  if (!data) return <div>loading</div>;
  if (data.message) {
    return <div>{data.message}</div>;
  }

  return (
    <div>
      <OrderDetailView data={data} />
    </div>
  );
};

export default DetailOrder;
