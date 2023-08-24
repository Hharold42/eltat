"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";

import a_fetcher from "@/utils/aFetcher";

const AddNewPerformer = () => {
  const [newPerformer, setNewPerformer] = useState({
    name: "",
    last_name: "",
    role: "ENGINEER",
  });
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

  const { data, isLoading } = useSWR("/api/performer", a_fetcher);

  if (isLoading) return <div>loading</div>;

  const createPerformer = async (popupToggle = () => {}) => {
    if (
      !newPerformer.last_name.trim() ||
      !newPerformer.name.trim() ||
      !newPerformer.role.trim()
    ) {
      return;
    }

    popupToggle();

    try {
      await axios.post("/api/performer", newPerformer);

      mutate("/api/performer", [...data, newPerformer], false);

      setNewPerformer({
        name: "",
        last_name: "",
        role: "",
      });
    } catch (e) {
      console.error("Error creating performer:", e);
    }
  };

  const popupToggle = () => {
    setPopup({ text: "Успешно", type: "success" });
    handleClick();
  };

  return (
    <div className="flex flex-col">
      <Snackbar open={showPopup} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={popup.type}
          sx={{ width: "100%" }}
        >
          {popup.text}
        </Alert>
      </Snackbar>
      <h2 className="text-xl font-semibold mb-2">Создание нового сотрудника</h2>
      <input
        type="text"
        className="border rounded px-2 py-1 mb-2"
        placeholder="Имя"
        value={newPerformer.name}
        onChange={(e) =>
          setNewPerformer({ ...newPerformer, name: e.target.value })
        }
      />
      <input
        type="text"
        className="border rounded px-2 py-1 mb-2"
        placeholder="Фамилия"
        value={newPerformer.last_name}
        onChange={(e) =>
          setNewPerformer({ ...newPerformer, last_name: e.target.value })
        }
      />
      <div className="flex flex-row border rounded px-2 py-1 mb-2 align-middle text-center">
        <label className="block py-1 px-2">Роль</label>
        <select
          className="border rounded px-2 py-1"
          value={newPerformer.role}
          onChange={(e) =>
            setNewPerformer({ ...newPerformer, role: e.target.value })
          }
        >
          <option value="ENGINEER">Инженер</option>
          <option value="FITTER">Монтажник</option>
        </select>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={(e) => {
          createPerformer(popupToggle);
        }}
      >
        Добваить сотрудника
      </button>
    </div>
  );
};

export default AddNewPerformer;
