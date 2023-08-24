"use client";

import fetcher from "@/utils/fetcher";
import { MultiSelect } from "primereact/multiselect";
import useSWR from "swr";
import { useEffect, useState } from "react";

const PerfMultiselect = ({ state, handler }) => {
  const { data, error, isLoading } = useSWR("/api/getPerformers", fetcher);
  const [options, setOptions] = useState([{ name: "loading", code: 0 }]);

  const getOptionsByCodes = (codes = []) => {
    return options.reduce((prev, curr) => {
      if (codes.includes(curr.code)) {
        return [...prev, curr];
      }
      return [...prev];
    }, []);
  };

  useEffect(() => {
    if (data) {
      setOptions(
        data.map((item) => ({
          name: `${item.name} ${item.lname} (${
            item.role[0] === "E" ? "И" : "М"
          })`,
          code: item.id,
        }))
      );
    }
  }, [data]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <span className="block text-lg font-semibold text-gray-800 mb-2">
        Команда
      </span>

      <MultiSelect
        value={getOptionsByCodes(state)}
        onChange={(e) => {
          const arr = e.value.map((item) => item.code);

          handler(e.value.map((item) => item.code));
        }}
        options={options}
        optionLabel="name"
        placeholder="Команда"
        maxSelectedLabels={10}
        className="mt-2 w-full z-0"
      />
    </div>
  );
};

export default PerfMultiselect;
