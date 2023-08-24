import PopupForm from "@/components/Popup";
import fetcher from "@/utils/fetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";

const SelectContactor = ({ handler = () => {}, plus = true, def = -1 }) => {
  const { data, error, isLoading } = useSWR(`/api/getContractor`, fetcher);
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
    <div className="p-4 bg-white rounded-lg shadow-md w-full">
      <span className="block text-lg font-semibold text-gray-800 mb-2">
        Контрагент
      </span>

      {plus === true ? (
        <PopupForm
          name="Новый контрагент"
          path="createContractor"
          updater={updateOnPost}
        >
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-600">Имя</span>
            <input
              type="text"
              name="name"
              className="mt-1 p-2 border rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            />
          </div>
          <div className="mb-6">
            <span className="text-sm font-medium text-gray-600">
              Комментарий
            </span>
            <textarea
              name="comment"
              className="mt-1 p-2 border rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            ></textarea>
          </div>
        </PopupForm>
      ) : (
        <></>
      )}

      <select
        name="contractorId"
        value={def}
        onChange={(e) => {
          handler(e);
        }}
        className="mt-2 block w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
      >
        {[
          <option key={"zerocont"} value={-1}></option>,
          ...options
            ?.map((item) => (
              <option
                key={`${item.id}`}
                value={item.id}
                className="text-gray-800"
              >
                {item.name}
              </option>
            ))
            .reverse(),
        ]}
      </select>
    </div>
  );
};

export default SelectContactor;
