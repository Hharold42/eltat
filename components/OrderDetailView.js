"use client";

import SelectContactor from "@/components/SelectContactor";
import SelectProject from "@/components/SelectProject";
import PerfMultiselect from "@/components/PerfMultiselect";
import NomenTable from "@/components/NomenTable";
import { Alert, Snackbar } from "@mui/material";

import { useState } from "react";
import checkForm from "@/utils/validators/checkOrderForm";
import DetailNomenTable from "./DetailNomenTable";
import ExcelExportButton from "./XLSXButton";
import axios from "axios";

const fulfillOreder = async (id) => {
  const body = {
    id: id,
  };

  await axios.put("/api/order", body);
};

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
  console.log(data);
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
    <div className="p-4 z-0 bg-[#F8F8F1] h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="[&>*]:mb-2 text-sm mr-2">
          <div className="flex items-center">
            <span className="text-black font-semibold pr-2 w-[120px] max-w-[120px]">
              Название
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => changeField(e)}
              className="w-[700px] border border-black border-solid rounded-sm px-2 py-1"
            />
          </div>
          <SelectContactor handler={changeField} def={formData.contractorId} />
          <SelectProject handler={changeField} def={formData.projectId} />
          <PerfMultiselect
            state={selectedPerformers}
            handler={setSelectedPerformers}
          />
          <div className="flex items-center">
            <span className="text-black font-semibold pr-2 w-[120px] max-w-[120px]">
              Дата оплаты
            </span>
            <input
              type="date"
              name="paydate"
              value={formData.paydate}
              onChange={(e) => changeField(e)}
              className="w-[350px] border border-black border-solid rounded-sm px-2 py-1"
            />
          </div>
          <div className="flex items-center">
            <span className="text-black font-semibold pr-2 w-[120px] max-w-[120px]">
              Дата отправки
            </span>
            <input
              type="date"
              name="shipdate"
              value={formData.shipdate}
              onChange={(e) => changeField(e)}
              className="w-[350px] border border-black border-solid rounded-sm px-2 py-1"
            />
          </div>
          <div className="flex items-center">
            <span className="text-black font-semibold pr-2 w-[120px] max-w-[120px]">
              Наценка
            </span>
            <input
              type="number"
              name="margin"
              value={formData.margin}
              onChange={(e) => changeField(e)}
              className="w-[350px] border border-black border-solid rounded-sm px-2 py-1"
            />
          </div>
          <div className="font-bold text-sm px-1 overflow-y-scroll max-h-[50vh] border">
            <table className="min-w-full border-collapse border border-gray-300 [&>*>tr>*]:border text-sm">
              <thead className="sticky top-0 bg-white">
                <tr
                  key="zeroselected"
                  className="bg-[#000480] text-white text-left sticky top-0"
                >
                  <th>Артикул</th>
                  <th>Наименование</th>
                  <th>Производитель</th>
                  <th>Ед.</th>
                  <th>Цена</th>
                  <th>Кол-во в упаковке</th>
                  <th>количество</th>
                </tr>
              </thead>

              <DetailNomenTable
                ids={data.nomenclature}
                state={selectedNomen}
                handler={setSelectedNomen}
              />
            </table>
          </div>
          <div className="flex items-center">
            <span className="text-black font-semibold pr-2 w-[120px] max-w-[120px]">
              Комментарий
            </span>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={(e) => changeField(e)}
              className="w-[700px] border border-black border-solid rounded-sm px-2 py-1"
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
              className=" block w-full px-4 py-2 text-white  bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
            >
              Обновить
            </button>
            <ExcelExportButton
              orderNomen={selectedNomen}
              name={data.name}
              id={data.id}
            />
            <button
              disabled={data.completed ? true : false}
              onClick={() => {
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
                fulfillOreder(data.id);
              }}
              className="block text-center w-full px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring focus:ring-indigo-200 disabled:bg-slate-900 disabled:cursor-not-allowed"
            >
              Завершить
            </button>
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
          <NomenTable handler={selectNomen} name={data.id} id={data.id} />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;
