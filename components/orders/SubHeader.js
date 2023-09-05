"use client";

import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useState } from "react";
import { BsFlagFill, BsCart3 } from "react-icons/bs";
import { BiDollar } from "react-icons/bi";
import getOrderFullData from "@/utils/orderFullData";
import OrdersFromIds from "./server/OrdersFromIds";
import { GrFormClose } from "react-icons/gr";
import { mutate } from "swr";

const exportXLSX = async (name, id, orderNomen) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "excelExport-function_dev-01";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Sheet1");
  worksheet.name = `Спецификация_${name}-${id}`;

  const columnWidths = [0, 0, 0, 0, 0];

  const headers = [
    "Артикул",
    "Производитель",
    "Наименование",
    "Единица",
    "Количество",
  ];

  // Add header row
  worksheet.addRow(["Спецификация для контрагента ПЭК по проекту КВЗ"]);
  worksheet.addRow([]);
  worksheet.addRow(headers);

  headers.map((value, index) => {
    columnWidths[index] = Math.max(columnWidths[index], value.length);
  });

  // Add data rows
  orderNomen.map((item) => {
    const rowData = [
      item.vendor,
      item.manname,
      item.fullname,
      item.unit,
      String(item.count),
    ];
    rowData.map((value, index) => {
      columnWidths[index] = Math.max(columnWidths[index], value.length);
    });
    worksheet.addRow(rowData);
  });

  columnWidths.map((width, index) => {
    worksheet.getColumn(index + 1).width = width + 2;
  });
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `Спецификация ${name}-${id}`);
};

const SubHeader = ({ checkedOrders = [], mutator, checker }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCheckOpen, setCheckOpen] = useState(false);
  const [addMargin, setAddMargin] = useState(0);
  const [amount, setAmout] = useState({});

  return (
    <div className="bg-gray-600 h-12 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex space-x-4">
        <span className="text-white text-lg font-semibold px-3">Заказы</span>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 flex-1 rounded-sm flex flex-row items-center"
          disabled={checkedOrders.length < 1}
          onClick={async () => {
            let proj;
            for (let i = 0; i < checkedOrders.length; i++) {
              const data = await getOrderFullData(checkedOrders[i]);
              if (!proj) {
                proj = data.data.projectId_;
              } else if (proj !== data.data.projectId_) {
                alert(
                  "Счет можно выписать только для заказов из одного и того же проекта"
                );
                return;
              }
            }
            setAmout(() => {
              let newAmount = {};
              checkedOrders.forEach((id) => {
                newAmount = { ...newAmount, [id]: 1 };
              });

              return newAmount;
            });
            setCheckOpen(true);
          }}
        >
          <BsFlagFill size={15} className="mx-[2px]" />
          Счет
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 flex-1 rounded-sm flex flex-row items-center"
          disabled={checkedOrders.length < 1}
          onClick={() => {
            checkedOrders.forEach(async (id) => {
              const data = await getOrderFullData(id);
              exportXLSX(data.data.name, data.data.id, data.parsedNomen);
            });
          }}
        >
          <BsCart3 size={15} className="mx-[2px]" />
          Спецификация
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 flex-1 rounded-sm flex flex-row items-center"
          disabled={checkedOrders.length < 1}
          onClick={() => {
            setModalOpen(true);
          }}
        >
          <BiDollar size={17} className="mx-[2px]" />
          Наценка
        </button>
      </div>
      <div className="flex space-x-4 text-slate-400">
        <button
          className="text-slate-400 px-3 py-1 hover:text-slate-200"
          onClick={async () => {
            await Promise.all(
              checkedOrders.map(async (id) => {
                checker(id);
                const data = await getOrderFullData(id);
                await axios.post(`/api/cloneOrder?id=${data.data.id}`);
              })
            );

            mutator(true);
          }}
        >
          Скопировать
        </button>
        <button
          className="text-slate-400 px-3 py-1 hover:text-slate-200"
          onClick={async () => {
            await Promise.all(
              checkedOrders.map(async (id) => {
                checker(id);
                const data = await getOrderFullData(id);
                await axios.delete(`/api/deleteOrder?id=${data.data.id}`);
              })
            );
            mutator(true);
          }}
        >
          Удалить
        </button>
      </div>
      {isModalOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-40 text-black">
          <div className="bg-white p-6 rounded-sm shadow-xl relative border border-slate-600">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              <GrFormClose size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Добавить наценку</h2>
            <div className="my-4 w-full">
              <span className="mr-2">Наценка</span>
              <input
                className="border rounded-sm border-black px-2 w-full"
                type="number"
                value={addMargin}
                onChange={(e) => {
                  setAddMargin(e.target.value);
                }}
              ></input>
            </div>
            <button
              className="block w-full px-4 py-2 text-white  bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
              onClick={async () => {
                await Promise.all(
                  checkedOrders.map(async (id) => {
                    checker(id);
                    const data = await getOrderFullData(id);
                    await axios.post("/api/updateOrder?mode=om", {
                      margin: parseInt(addMargin, 10),
                      id: data.data.id,
                      prevMargin: parseInt(data.data.margin, 10),
                    });
                  })
                );

                mutator(true);
                setModalOpen(false);
              }}
            >
              Применить
            </button>
          </div>
          <div className="fixed w-full h-full bg-black opacity-40 -z-10"></div>
        </div>
      ) : (
        <></>
      )}
      {isCheckOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-40 text-black">
          <div className="bg-white p-6 rounded-sm shadow-xl relative border border-slate-600">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => {
                setCheckOpen(false);
              }}
            >
              <GrFormClose size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Выпустить счет</h2>
            <div className="flex flex-col justify-start items-start [&>*]:mb-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 flex-1 rounded-sm flex flex-row items-center w-[300px] border-2 border-slate-900"
                onClick={async () => {
                  const dataArr = await Promise.all(
                    checkedOrders.map(async (id) => {
                      let data = await getOrderFullData(id);
                      data = { ...data, amount: amount[id] };

                      return data;
                    })
                  );

                  await axios
                    .post(
                      "/api/handleXlsx",
                      { dataArr },
                      { responseType: "blob" }
                    )
                    .then((res) => {
                      const blob = new Blob([res.data], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                      });
                      saveAs(
                        blob,
                        `Счет ${dataArr[0].projectName}-${dataArr[0].data.files.length}`
                      );
                    });
                }}
              >
                Скачать XLSX
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 flex-1 rounded-sm flex flex-row items-center w-[300px] border-2 border-slate-900"
                onClick={async () => {
                  checkedOrders.map(async (id) => {
                    const dataArr = await Promise.all(
                      checkedOrders.map(async (id) => {
                        let data = await getOrderFullData(id);
                        data = { ...data, amount: amount[id] };

                        return data;
                      })
                    );

                    await axios.post("/api/handleXlsx?mode=s", { dataArr });
                  });

                  mutator(true);
                }}
              >
                Сохранить в базу
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 flex-1 rounded-sm flex flex-row items-center w-[300px] border-2 border-slate-900"
                onClick={async () => {
                  checkedOrders.map(async (id) => {
                    const dataArr = await Promise.all(
                      checkedOrders.map(async (id) => {
                        let data = await getOrderFullData(id);
                        data = { ...data, amount: amount[id] };

                        return data;
                      })
                    );

                    await axios
                      .post(
                        "/api/handleXlsx?mode=s",
                        { dataArr },
                        { responseType: "blob" }
                      )
                      .then((res) => {
                        const blob = new Blob([res.data], {
                          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        });
                        saveAs(
                          blob,
                          `Счет ${dataArr[0].projectName}-${dataArr[0].data.files.length}.xlsx`
                        );
                      });
                  });
                  mutator(true);
                }}
              >
                Скачать XLSX и сохранить в базу
              </button>
            </div>
            <div className="font-bold px-1 text-sm">
              <table className="min-w-full border-collapse border border-gray-300 [&>*>tr>*]:border text-sm">
                <thead>
                  <tr className="bg-[#000480] text-white text-left [&>*]:px-2 [&>*]:py-1">
                    <th>№</th>
                    <th>Название</th>
                    <th>Проект</th>
                    <th>Себестоимость</th>
                    <th>Наценка</th>
                    <th>Кол-во</th>
                    <th>Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {checkedOrders.map((id) => (
                    <OrdersFromIds
                      id={id}
                      amountSetter={setAmout}
                      amount={amount}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="fixed w-full h-full bg-black opacity-40 -z-10"></div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SubHeader;
