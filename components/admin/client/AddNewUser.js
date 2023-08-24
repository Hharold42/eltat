"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";

import a_fetcher from "@/utils/aFetcher";

const AddNewUser = () => {
  const [newUser, setNewUser] = useState({
    name: "",
    last_name: "",
    role: "USER",
    email: "",
    password: "",
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

  const { data, isLoading } = useSWR("/api/user", a_fetcher);

  if (isLoading) return <div>loading</div>;

  const createUser = async (popupToggle = () => {}) => {
    if (
      !newUser.last_name.trim() ||
      !newUser.name.trim() ||
      !newUser.role.trim() ||
      !newUser.email.trim() ||
      !newUser.password.trim()
    ) {
      return;
    }

    popupToggle();

    try {
      await axios.post("/api/user", newUser);

      mutate("/api/user", [...data, newUser], false);

      setNewUser({
        name: "",
        role: "",
        email: "",
        password: "",
        last_name: "",
      });
    } catch (e) {
      console.error("Error creating user:", e);
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
      <h2 className="text-xl font-semibold mb-2">
        Создание нового пользователя
      </h2>
      <input
        type="text"
        className="border rounded px-2 py-1 mb-2"
        placeholder="Имя"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <input
        type="text"
        className="border rounded px-2 py-1 mb-2"
        placeholder="Фамилия"
        value={newUser.last_name}
        onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
      />
      <div className="flex flex-row border rounded px-2 py-1 mb-2 align-middle text-center">
        <label className="block py-1 px-2">Роль</label>
        <select
          className="border rounded px-2 py-1"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="USER">Пользователь</option>
          <option value="ADMIN">Админ</option>
          <option value="DEV">Разработчик</option>
        </select>
      </div>
      <input
        type="email"
        autoComplete="off"
        aria-autocomplete="off"
        className="border rounded px-2 py-1 mb-2"
        placeholder="Эл. почта"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <input
        type="password"
        autoComplete="new-password"
        className="border rounded px-2 py-1 mb-2"
        placeholder="Пароль"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => {
          createUser(popupToggle);
        }}
      >
        Добваить пользователя
      </button>
    </div>
  );
};

export default AddNewUser;
