"use client";

import SelectContactor from "../../components/SelectContactor";
import SelectProject from "../../components/SelectProject";
import PerfMultiselect from "../../components/PerfMultiselect";
import NomenTable from "../../components/NomenTable";
import { useState } from "react";
import checkForm from "@/utils/validators/checkOrderForm";
import { Alert, Snackbar } from "@mui/material";

const sendPost = async (form, nomen, perfs) => {
  let cost = 0;

  nomen.map((item) => {
    cost += item.price * item.count;
  });

  const body = {
    ...form,
    teamIds: perfs,
    nomenclature: nomen.reduce((prev, curr) => {
      let newItem = [...prev];
      for (let i = 0; i < curr.count; i++) {
        newItem = [...newItem, curr.id];
      }

      return newItem;
    }, []),
    cost: cost,
  };

  const data = await fetch(`/api/createOrder`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const res = await data.json();
};

function OrderCreate() {
  const [formData, setFormData] = useState({
    name: null,
    contractorId: -1,
    paydate: null,
    shipdate: null,
    margin: null,
    comment: null,
    projectId: -1,
  });
  const [selectedNomen, setSelectedNomen] = useState([]);
  const [selectedPerformers, setSelectedPerformers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popup, setPopup] = useState({ text: "", type: "error" });

  const handleClick = () => {
    setShowPopup(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowPopup(false);
  };

  const changeField = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newObj = { ...prev };
      newObj[name] = value;
      return newObj;
    });
  };

  const selectNomen = (item) => {
    setSelectedNomen((prev) => {
      const newArr = [...prev];

      for (let i = 0; i < newArr.length; i++) {
        if (newArr[i].id === item.id) {
          newArr[i].count++;
          return newArr;
        }
      }
      return [...newArr, { ...item, count: 1 }];
    });
  };

  const changeNomenCountByIndex = (value, index) => {
    setSelectedNomen((prev) => {
      const newNomen = prev.map((item, i) => {
        if (i === index) {
          return { ...item, count: value };
        }
        return item;
      });

      if (newNomen[index].count <= 0) {
        newNomen.splice(index, 1);
      }

      return newNomen;
    });
  };

  return (
    <div className="p-4 z-0 bg-slate-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="[&>*]:mb-4">
          <div className="mb-2 p-4 bg-white rounded-lg shadow-md w-full">
            <span className="block text-lg font-semibold text-gray-800">
              Название
            </span>
            <input
              type="text"
              name="name"
              placeholder="Название заказа"
              onChange={(e) => changeField(e)}
              className="mt-2 p-2 border rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            />
          </div>
          <SelectContactor handler={changeField} def={formData.contractorId} />
          <SelectProject handler={changeField} def={formData.projectId} />
          <PerfMultiselect
            state={selectedPerformers}
            handler={setSelectedPerformers}
          />
          <div className="mb-2 p-4 bg-white rounded-lg shadow-md w-full">
            <span className="block text-sm font-medium text-gray-600">
              Дата оплаты
            </span>
            <input
              type="date"
              name="paydate"
              onChange={(e) => changeField(e)}
              className="mt-1 p-2 border rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            />
          </div>
          <div className="mb-2 p-4 bg-white rounded-lg shadow-md w-full">
            <span className="block text-sm font-medium text-gray-600">
              Дата отправки
            </span>
            <input
              type="date"
              name="shipdate"
              onChange={(e) => changeField(e)}
              className="mt-1 p-2 border rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            />
          </div>
          <div className="mb-2 p-4 bg-white rounded-lg shadow-md w-full">
            <span className="block text-sm font-medium text-gray-600">
              Наценка
            </span>
            <input
              type="number"
              name="margin"
              onChange={(e) => changeField(e)}
              className="mt-1 p-2 border rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            />
          </div>
          <div className="max-w-[100%] overflow-auto max-h-[60vh] p-2 bg-white rounded-md">
            <table className="w-full max-w-full border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr key="zeroselected" className="">
                  <th className="px-1 py-2">Артикул</th>
                  <th className="px-1 py-2">Наименование</th>
                  <th className="px-1 py-2">Производитель</th>
                  <th className="px-1 py-2">Ед.</th>
                  <th className="px-1 py-2">Цена</th>
                  <th className="px-1 py-2">Кол-во в упаковке</th>
                  <th className="px-1 py-2">количество</th>
                </tr>
              </thead>
              <tbody>
                {selectedNomen.map((item, index) => (
                  <tr
                    id={item.id}
                    key={`${item.id}nomen`}
                    className="py-2 text-center bg-gray-50 odd:bg-gray-400 even:bg-slate-50 border-b-2 border-solid border-slate-700 "
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
                          value={selectedNomen[index].count}
                          className="mr-2 max-w-[4rem] text-center border-2 border-black rounded"
                          onChange={(e) =>
                            changeNomenCountByIndex(e.target.value, index)
                          }
                        ></input>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-2 p-4 bg-white rounded-lg shadow-md w-full">
            <span className="block text-sm font-medium text-gray-600">
              Комментарий
            </span>
            <textarea
              name="comment"
              placeholder="..."
              onChange={(e) => changeField(e)}
              className="mt-1 p-2 border rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            ></textarea>
          </div>
          <button
            onClick={(e) => {
              const isValid = checkForm(formData);
              if (isValid.code === -1) {
                setPopup({ text: isValid.message, type: "error" });
                handleClick();
                return;
              }
              if (selectedNomen.length < 1) {
                setPopup({ text: "Не выбрана номенклатура", type: "error" });
                handleClick();
                return;
              }
              if (selectedPerformers.length < 1) {
                setPopup({ text: "Не выбраны исполнители", type: "error" });
                handleClick();
                return;
              }

              setPopup({ text: "Успешно", type: "success" });
              handleClick();
              sendPost(formData, selectedNomen, selectedPerformers);
            }}
            className="block w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Создать заказ
          </button>
          <Snackbar
            open={showPopup}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity={popup.type}
              sx={{ width: "100%" }}
            >
              {popup.text}
            </Alert>
          </Snackbar>
        </div>
        <div>
          <NomenTable handler={selectNomen} />
        </div>
      </div>
    </div>
  );
}

export default OrderCreate;
