"use client";

import fetcher from "@/utils/fetcher";
import { MultiSelect } from "primereact/multiselect";
import useSWR from "swr";
import { useEffect, useState } from "react";

const PerfMultiselect = ({ state, handler }) => {
  const { data, error, isLoading } = useSWR("api/getPerformers", fetcher);
  const [options, setOptions] = useState([{ name: "loading", code: 0 }]);

  useEffect(() => {
    if (data) {
      setOptions(
        data.map((item) => ({
          name: `${item.name} ${item.lname}`,
          code: item.id,
        }))
      );
    }
  }, [data]);

  return (
    <div>
      <span>Команда</span>
      <MultiSelect
        value={state}
        onChange={(e) => handler(e.value)}
        options={options}
        optionLabel="name"
        placeholder="Команда"
        maxSelectedLabels={10}
        className=""
      />
    </div>
  );
};

export default PerfMultiselect;
