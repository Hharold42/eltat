"use client";

import SelectContactor from "../../components/SelectContactor";
import SelectProject from "../../components/SelectProject";
import PerfMultiselect from "../../components/PerfMultiselect";
import NomenTable from "../../components/NomenTable";
import { useState } from "react";
import checkForm from "@/utils/validators/checkOrderForm";
import { Alert, Snackbar } from "@mui/material";

import { useSession } from "next-auth/react";
import rounded from "@/utils/round";

const sendPost = async (form, nomen, perfs, uid) => {
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
    uid: uid,
  };

  const data = await fetch(`/api/createOrder`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const res = await data.json();
};

function OrderCreate() {
  const { data: session, status } = useSession();

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
    <div className="p-4 z-0 bg-[#F8F8F1] h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="[&>*]:mb-4">
          <div className="w-full px-2 py-1 flex flex-row">
            <span className="py-1 text-black font-semibold pr-2 max-w-[10%] w-[10%]">
              Название
            </span>
            <input
              type="text"
              name="name"
              placeholder="Название заказа"
              onChange={(e) => changeField(e)}
              className="ml-4 w-full border border-black border-solid rounded-sm px-2 py-2"
            />
          </div>
          <div className="flex flex-row">
            <SelectContactor
              handler={changeField}
              def={formData.contractorId}
            />
            <SelectProject handler={changeField} def={formData.projectId} />
          </div>
          <PerfMultiselect
            state={selectedPerformers}
            handler={setSelectedPerformers}
          />
          <div className="w-full px-2 py-1 flex flex-row">
            <span className="py-1 text-black font-semibold pr-2 max-w-[10%] w-[10%]">
              Дата оплаты
            </span>
            <input
              type="date"
              name="paydate"
              onChange={(e) => changeField(e)}
              className="ml-4 w-full border border-black border-solid rounded-sm px-2 py-2"
            />
          </div>
          <div className="w-full px-2 py-1 flex flex-row">
            <span className="py-1 text-black font-semibold pr-2 max-w-[10%] w-[10%]">
              Дата отправки
            </span>
            <input
              type="date"
              name="shipdate"
              onChange={(e) => changeField(e)}
              className="ml-4 w-full border border-black border-solid rounded-sm px-2 py-2"
            />
          </div>
          <div className="w-full px-2 py-1 flex flex-row">
            <span className="py-1 text-black font-semibold pr-2 max-w-[10%] w-[10%]">
              Наценка
            </span>
            <input
              type="number"
              name="margin"
              onChange={(e) => changeField(e)}
              className="ml-4 w-full border border-black border-solid rounded-sm px-2 py-2"
            />
          </div>
          <div className="font-bold text-sm px-1 overflow-y-scroll max-h-[30vh] border">
            <table className="min-w-full border-collapse border border-gray-300 [&>*>tr>*]:border text-sm">
              <thead className="sticky top-0 bg-white">
                <tr
                  key="zeroselected"
                  className=" bg-[#000480] text-white text-left sticky top-0"
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
              <tbody>
                <tr className="text-right font-bold [&>*]:pr-4">
                  <td colSpan={4}>Итого: </td>
                  <td>
                    {selectedNomen.length > 0
                      ? rounded(
                          selectedNomen.reduce((prev, curr) => {
                            console.log(curr);
                            return prev + curr.price * curr.count;
                          }, 0)
                        )
                      : 0}
                  </td>
                </tr>
                {selectedNomen.map((item, index) => (
                  <tr
                    id={item.id}
                    key={`${item.id}nomen`}
                    className="hover:bg-gray-50 text-left font-medium [&>*]:px-1"
                  >
                    <td>{item.vendor}</td>
                    <td>{item.name}</td>
                    <td>{item.manname}</td>
                    <td>{item.unit}</td>
                    <td>{item.price * item.count}</td>
                    <td>{item.amount}</td>
                    <td>
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
          <div className="w-full px-2 py-1 flex flex-row">
            <span className="py-1 text-black font-semibold pr-2 max-w-[10%] w-[10%]">
              Комментарий
            </span>
            <textarea
              name="comment"
              placeholder="..."
              onChange={(e) => changeField(e)}
              className="ml-4 w-full px-2 border border-black border-solid rounded-sm"
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
              sendPost(
                formData,
                selectedNomen,
                selectedPerformers,
                session?.user?.id
              );
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
