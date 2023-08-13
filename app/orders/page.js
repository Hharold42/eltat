"use client";

import SelectContactor from "./SelectContactor";
import SelectProject from "./SelectProject";
import PerfMultiselect from "./PerfMultiselect";
import NomenTable from "./NomenTable";
import { useEffect, useState } from "react";

function Orders() {
  const [formData, setFormData] = useState({
    name: null,
    contractorId: null,
    paydate: null,
    shipdate: null,
    margin: null,
    comment: null,
    projectId: null,
    teamIds: [],
  });
  const [selectedNomen, setSelectedNomen] = useState([]);
  const [selectedPerformers, setSelectedPerformers] = useState([]);

  const changeField = (name, value) => {
    setFormData((prev) => {
      const newObj = { ...prev };
      newObj[name] = value;
      return newObj;
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

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

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col">
        <div>
          <span>Название</span>
          <input
            type="text"
            name="name"
            onChange={(e) => changeField(e.target.name, e.target.value)}
          />
        </div>
        <SelectContactor handler={changeField} />
        <SelectProject handler={changeField} />
        <PerfMultiselect
          state={selectedPerformers}
          handler={setSelectedPerformers}
        />
        <div className="flex flex-row">
          <span>Дата оплаты</span>
          <input
            type="date"
            name="paydate"
            onChange={(e) => changeField(e.target.name, e.target.value)}
          />
        </div>
        <div className="flex flex-row">
          <span>Дата отправки</span>
          <input
            type="date"
            name="shipdate"
            onChange={(e) => changeField(e.target.name, e.target.value)}
          />
        </div>
        <div className="flex flex-row">
          <span>Наценка</span>
          <input
            type="number"
            name="margin"
            onChange={(e) => changeField(e.target.name, e.target.value)}
          />
        </div>
        <div className="max-h-[340px] max-w-[720px] overflow-scroll">
          <table>
            <thead>
              <tr key={"zeroselected"}>
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
              {selectedNomen.map((item, index) => (
                <tr
                  id={item.id}
                  key={`${item.id}nomen`}
                  className={`${
                    index % 2 === 1 ? "bg-gray-400" : "bg-slate-50"
                  }`}
                >
                  <td>{item.vendor}</td>
                  <td>{item.name}</td>
                  <td>{item.manname}</td>
                  <td>{item.unit}</td>
                  <td>{item.price * item.count}</td>
                  <td>{item.amount}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-row">
        <NomenTable handler={selectNomen} />
      </div>
    </div>
  );
}

export default Orders;
