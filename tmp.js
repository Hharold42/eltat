"use client";

import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { MultiSelect } from "primereact/multiselect";
import PopupForm from "../../components/Popup";
import NewContractorForm from "./newContractor";
import useContractors from "@/hooks/useContractors";
import useProjects from "@/hooks/useProj";

function Orders() {
  const [orderData, setOrderData] = useState({
    name: null,
    contractor: null,
    project: null,
    team: [],
    paydate: null,
    shipdate: null,
    margin: null,
  });

  const { contrs } = useContractors();
  const { projects } = useProjects();

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedNomenclature, setSelectedNomenclature] = useState([]);
  const [nomenclature, setNomenclature] = useState([]);

  const changeHandler = (e) => {
    e.preventDefault();
    setOrderData((prev) => {
      const newObj = { ...prev };
      newObj[e.target.name] = e.target.value;
      return newObj;
    });
  };

  useEffect(() => {
    console.log(orderData);
  }, [orderData]);

  useEffect(() => {
    const fetchProj = async () => {
      const projResp = await fetch("/api/getProject");
      const projJson = await projResp.json();
      projJson.forEach((item) =>
        setProjOptions((prev) => [
          ...prev,
          <option value={item.id} key={`${item.id}-proj`}>
            {item.name}
          </option>,
        ])
      );
    };

    const fetchContr = async () => {
      const contrResp = await fetch(`/api/getContractor`);

      const contrJson = await contrResp.json();

      contrJson.forEach((item) =>
        setContOptions((prev) => [
          ...prev,
          <option value={item.id} key={`${item.id}-contr`}>
            {item.name}
          </option>,
        ])
      );
    };

    const fetchPerformers = async () => {
      const perfResp = await fetch(`/api/getPerformers`);

      const perfJson = await perfResp.json();

      perfJson.forEach((item) =>
        setPerfOptions((prev) => [
          ...prev,
          { name: `${item.name} ${item.lname}`, code: item.id },
        ])
      );
    };

    const fetchNomenclature = async () => {
      const nomenResp = await fetch(`/api/getNomenclature`);

      const nomenJson = await nomenResp.json();

      nomenJson.forEach((item) =>
        setNomenclature((prev) => [
          ...prev,
          <tr key={`${item.id}-nomen`}>
            <td>
              <Button
                variant="light"
                onClick={(e) =>
                  setSelectedNomenclature((prev) => {
                    const newArr = [...prev];

                    for (let i = 0; i < newArr.length; i++) {
                      if (newArr[i].id === item.id) {
                        newArr[i].number++;
                        return newArr;
                      }
                    }
                    return [...newArr, { ...item, number: 1 }];
                  })
                }
              >
                +
              </Button>
            </td>
            <td>{item.vendor}</td>
            <td>{item.name}</td>
            <td>{item.manname}</td>
            <td>{item.unit}</td>
            <td>{item.price}</td>
            <td>{item.amount}</td>
          </tr>,
        ])
      );
    };

    fetchContr();
    fetchProj();
    fetchPerformers();
    fetchNomenclature();
  }, []);

  useEffect(() => {
    console.log(selectedNomenclature);
  }, [selectedNomenclature]);

  useEffect(() => {
    if (selectedEmployees.length > 0) {
      const data = selectedEmployees.map((emplyee) => emplyee.code);
      setOrderData((prev) => {
        const newObj = { ...prev };

        newObj.team = data;
        return newObj;
      });
    }
  }, [selectedEmployees]);

  const generateSelectedNomen = () => {
    return selectedNomenclature.map((item) => (
      <tr>
        <td>{item.vendor}</td>
        <td>{item.name}</td>
        <td>{item.manname}</td>
        <td>{item.unit}</td>
        <td>{item.price}</td>
        <td>{item.amount}</td>
        <td>
          {item.number}
          <Button
            variant="light"
            onClick={(e) => {
              setSelectedNomenclature((prev) => {
                const newArr = [...prev];

                for (let i = 0; i < newArr.length; i++) {
                  if (newArr[i].id === item.id) {
                    newArr[i].number++;
                    newArr[i].price *= newArr[i].number;
                    return newArr;
                  }
                }
              });
            }}
          >
            +
          </Button>
          <Button
            variant="light"
            onClick={(e) => {
              setSelectedNomenclature((prev) => {
                const newArr = [...prev];

                for (let i = 0; i < newArr.length; i++) {
                  if (newArr[i].id === item.id) {
                    if (newArr[i].number === 1) {
                      newArr.splice(i, 1);
                      return newArr;
                    }
                    newArr[i].number--;
                    newArr[i].price *= newArr[i].number;
                    return newArr;
                  }
                }
              });
            }}
          >
            -
          </Button>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <div className="flex flex-row">
        <span>Название</span>
        <input onChange={(e) => changeHandler(e)} name={"name"}></input>
      </div>
      <div className="flex flex-row">
        <span>Контрагент</span>
        <PopupForm name={"Новый контрагент"} path="createContractor">
          <NewContractorForm />
        </PopupForm>
        <select onChange={(e) => changeHandler(e)} name="contractor">
          {contrs ? (
            contrs.map((contr) => (
              <option key={`${contr.id}contr`} value={contr.id}>
                {contr.name}
              </option>
            ))
          ) : (
            <option></option>
          )}
        </select>
      </div>
      <div className="flex flex-row">
        <span>Проект</span>
        <select onChange={(e) => changeHandler(e)} name="project">
          {projects ? (
            projects.map((contr) => (
              <option key={`${contr.id}contr`} value={contr.id}>
                {contr.name}
              </option>
            ))
          ) : (
            <option></option>
          )}
        </select>
      </div>

      <div className="flex flex-row">
        <span>Команда</span>
        <MultiSelect
          value={selectedEmployees}
          onChange={(e) => setSelectedEmployees(e.value)}
          options={perfOptions}
          optionLabel="name"
          placeholder="Команда"
          maxSelectedLabels={10}
          className=""
        />
      </div>
      <div className="flex flex-row">
        <span>Дата оплаты</span>
        <input type="date" onChange={(e) => changeHandler(e)} name="paydate" />
      </div>
      <div className="flex flex-row">
        <span>Дата отправки</span>
        <input type="date" onChange={(e) => changeHandler(e)} name="shipdate" />
      </div>
      <div className="flex flex-row">
        <span>Наценка</span>
        <input type="number" onChange={(e) => changeHandler(e)} name="margin" />
      </div>
      <div className="flex flex-row">
        <table>
          <thead>
            <tr key={"zeronomen"}>
              <th>Артикул</th>
              <th>Наименование</th>
              <th>Производитель</th>
              <th>Ед.</th>
              <th>Цена</th>
              <th>Кол-во в упаковке</th>
              <th>Кол-во</th>
            </tr>
          </thead>
          <tbody>{generateSelectedNomen()}</tbody>
        </table>
        <table>
          <thead>
            <tr key={"zeronomen"}>
              <th>+</th>
              <th>Артикул</th>
              <th>Наименование</th>
              <th>Производитель</th>
              <th>Ед.</th>
              <th>Цена</th>
              <th>Кол-во в упаковке</th>
            </tr>
          </thead>
          <tbody>{nomenclature}</tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
