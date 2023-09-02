"use client";

import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useState } from "react";

const getOrderFullData = async (id) => {
  const data = (await axios.get(`/api/getOrders?detail=${id}`)).data;

  const nomenIds = data.nomenclature;

  const nomenAoO = (await axios.get(`/api/getNomenclature?ids=${nomenIds}`))
    .data;

  const parsedNomen = nomenAoO?.map((item) => {
    let count = 0;
    nomenIds.map((id) => {
      if (id === item.id) {
        count++;
      }
    });

    return { ...item, count: count };
  });

  const contractor = (
    await axios.get(`/api/getContractor?id=${data.contractorId}`)
  ).data;

  const project = (await axios.get(`/api/getProject?id=${data.projectId_}`))
    .data;

  const contractorName = contractor.name;
  const projectName = project.name;

  return { data, parsedNomen, contractorName, projectName };
};

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

const SubHeader = ({ checkedOrders = [] }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [addMargin, setAddMargin] = useState(0);

  return (
    <div className="py-4 px-6 flex items center  justify-between rounded-b-sm sticky top-0 bg-gray-700 p-4 text-white z-20">
      <div className="flex space-x-4">
        <span className=" text-xl font-semibold py-1 px-4">Заказы</span>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-sm flex-1"
          disabled={checkedOrders.length < 1}
          onClick={() => {
            checkedOrders.forEach(async (id) => {
              const data = await getOrderFullData(id);
              await axios
                .post(
                  "/api/handleXlsx",
                  {
                    contractor: data.contractorName,
                    nomenclature: data.parsedNomen,
                    order: data.data,
                    project: data.projectName,
                  },
                  { responseType: "blob" }
                )
                .then((res) => {
                  const blob = new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  });
                  saveAs(blob, `Счет ${data.data.name}-${data.data.id}`);
                });
            });
          }}
        >
          Счет
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-sm flex-1"
          disabled={checkedOrders.length < 1}
          onClick={() => {
            checkedOrders.forEach(async (id) => {
              const data = await getOrderFullData(id);
              exportXLSX(data.data.name, data.data.id, data.parsedNomen);
            });
          }}
        >
          Спецификация
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-sm flex-1"
          disabled={checkedOrders.length < 1}
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Наценка
        </button>
      </div>
      <div className="flex space-x-4 [&>*]:text-white">
        <button
          onClick={() => {
            checkedOrders.forEach(async (id) => {
              const data = await getOrderFullData(id);
              await axios.get(`/api/cloneOrder?id=${data.data.id}`);
            });
           
            window.location.reload();
          }}
        >
          Скопировать
        </button>
        <button
          onClick={() => {
            checkedOrders.forEach(async (id) => {
              const data = await getOrderFullData(id);
              await axios.delete(`/api/deleteOrder?id=${data.data.id}`);
            });
            window.location.reload();
          }}
        >
          Удалить
        </button>
      </div>
      {isModalOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-40 text-black">
          <div className="bg-white p-6 rounded shadow-xl relative border border-slate-600">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Close
            </button>
            <h2 className="text-xl font-semibold mb-4">Добавить наценку</h2>
            <div className="">
              <span>Наценка</span>
              <input
                type="number"
                value={addMargin}
                onChange={(e) => {
                  setAddMargin(e.target.value);
                }}
              ></input>
            </div>
            <button
              onClick={() => {
                checkedOrders.forEach(async (id) => {
                  const data = await getOrderFullData(id);
                  await axios.post("/api/updateOrder?mode=om", {
                    margin: parseInt(addMargin, 10),
                    id: data.data.id,
                    prevMargin: parseInt(data.data.margin, 10),
                  });
                });

                window.location.reload();
              }}
            >
              Применить
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SubHeader;
