import PopupForm from "@/components/Popup";
import fetcher from "@/utils/fetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";

const SelectContactor = ({ handler }) => {
  const { data, error, isLoading } = useSWR("api/getContractor", fetcher);
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
      <span>Контрагент</span>
      <PopupForm
        name={"Новый контрагент"}
        path="createContractor"
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
        name="contractorId"
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

export default SelectContactor;
