import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Plus } from "feather-icons-react";
import { AiOutlinePlus } from "react-icons/ai";

const sendPost = async (form, path, updater) => {
  const elements = form.elements;
  const noe = form.childElementCount;

  const req = {};
  for (let i = 0; i < noe; i++) {
    const element = elements[i];
    if (element.name === "submit") continue;

    req[element.name] = element.value;
  }

  const data = await fetch(`/api/${path}`, {
    method: "POST",
    body: JSON.stringify(req),
  });
  const res = await data.json();

  if (!res.ok) updater(res);
};

const PopupForm = ({ name, path, updater = () => {}, children }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <div className="">
      <button
        onClick={togglePopup}
        className="bg-white border-2 border-indigo-800 text-indigo-900 rounded-sm p-1"
      >
        <AiOutlinePlus size={15} />
      </button>

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-40">
          <div className="bg-white p-6 rounded shadow-xl relative border border-slate-600">
            <button
              onClick={togglePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            <h2 className="text-xl font-semibold mb-4">{name}</h2>
            <form>
              {children}
              <button
                name="submit"
                className="block w-full px-4 py-2 text-white  bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
                onClick={(e) => {
                  e.preventDefault();
                  sendPost(e.target.parentElement, path, updater);
                  togglePopup();
                }}
              >
                Отправить
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupForm;
