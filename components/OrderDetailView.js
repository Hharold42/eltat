"use client";

import SelectContactor from "@/components/SelectContactor";
import SelectProject from "@/components/SelectProject";
import PerfMultiselect from "@/components/PerfMultiselect";
import NomenTable from "@/components/NomenTable";
import { Alert, Snackbar } from "@mui/material";

import { useState } from "react";
import checkForm from "@/utils/validators/checkOrderForm";
import DetailNomenTable from "./DetailNomenTable";
import { CSVDownload, CSVLink } from "react-csv";

const updateOrder = async (form, nomen, perfs, id) => {
  let cost = 0;

  nomen.map((item) => {
    cost += item.price * item.count;
  });

  console.log(cost);

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
    id: id,
  };

  const data = await fetch(`/api/updateOrder`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  const res = await data.json();
};

const OrderDetailView = ({ data }) => {
  const [formData, setFormData] = useState({
    name: data.name,
    contractorId: data.contractorId,
    paydate: new Date(data.paydate).toISOString().substr(0, 10),
    shipdate: new Date(data.shipdate).toISOString().substr(0, 10),
    margin: data.margin,
    comment: data.comment,
    projectId: data.projectId_,
  });
  const [selectedNomen, setSelectedNomen] = useState([]);
  const [selectedPerformers, setSelectedPerformers] = useState(data.teamIds);
  const [showPopup, setShowPopup] = useState(false);
  const [popup, setPopup] = useState({ text: "", type: "error" });

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
              value={formData.name}
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
              value={formData.paydate}
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
              value={formData.shipdate}
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
              value={formData.margin}
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
                <DetailNomenTable
                  ids={data.nomenclature}
                  state={selectedNomen}
                  handler={setSelectedNomen}
                />
              </tbody>
            </table>
          </div>
          <div className="mb-2 p-4 bg-white rounded-lg shadow-md w-full">
            <span className="block text-sm font-medium text-gray-600">
              Комментарий
            </span>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={(e) => changeField(e)}
              className="mt-1 p-2 border rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            ></textarea>
          </div>
          <div className="w-full flex flex-row">
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
                updateOrder(
                  formData,
                  selectedNomen,
                  selectedPerformers,
                  data.id
                );
              }}
              className=" block w-full px-4 py-2 text-white  bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-indigo-200"
            >
              Обновить
            </button>
            <CSVLink
              data={[{ name: "test", lastName: "lol", email: "lolers" }]}
            >
              CSVDownload
            </CSVLink>
            <div className=" block text-center w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-indigo-200">
              Удалить
            </div>
          </div>
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
};

export default OrderDetailView;
