import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Plus } from "feather-icons-react";

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

  console.log(res.ok);
  // if (!res.ok) updater(res);
};

const PopupForm = ({ name, path, updater = () => {}, children }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <div>
      <Button onClick={togglePopup} variant="light">
        <Plus size={18} className="mr-2" />
      </Button>

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 ">
          <div className="bg-white p-6 rounded shadow-md relative">
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
                onClick={(e) => {
                  e.preventDefault();
                  sendPost(e.target.parentElement, path, updater);
                  togglePopup();
                }}
              >
                Click
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupForm;
