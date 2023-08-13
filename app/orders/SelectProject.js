"use client";

import PopupForm from "@/components/Popup";
import fetcher from "@/utils/fetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";

const SelectProject = ({ handler }) => {
  const { data, error, isLoading } = useSWR("api/getProject", fetcher);
  const [options, setOptions] = useState([]);

  const updateOnPost = (item) => {
    setOptions((prev) => [...prev, item]);
  };

  useEffect(() => {
    if (isLoading) setOptions([<option>loading</option>]);
    else {
      setOptions(data);
    }
  }, [data, isLoading]);

  return (
    <div>
      <span>Проект</span>
      <PopupForm
        name={"Новый проект"}
        path="createProject"
        updater={updateOnPost}
      >
        <div>
          <span>Имя</span>
          <input type="text" name="name" />
        </div>
        <div>
          <span>Комментарий</span>
          <textarea name="comment"></textarea>
        </div>
      </PopupForm>
      <select
        name="projectId"
        onChange={(e) => handler(e.target.name, e.target.value)}
      >
        {options.map((item) => (
          <option key={`${item.id}`} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectProject;
