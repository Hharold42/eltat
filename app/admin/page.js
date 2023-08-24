import AddNewPerformer from "@/components/admin/client/AddNewEmployee";
import AddNewUser from "@/components/admin/client/AddNewUser";
import React from "react";

const AdminPanel = () => {
  return (
    <div className="container mx-auto p-4 grid grid-cols-2 gap-4">
      <div className="col-span-1 bg-gray-100 p-4 rounded shadow-md">
        <AddNewUser />
      </div>
      <div className="col-span-1 bg-gray-100 p-4 rounded shadow-md">
        <AddNewPerformer />
      </div>
      <div className="col-span-1 bg-white p-4 rounded"> </div>
      <div className="col-span-2 bg-white p-4 rounded"> </div>
    </div>
  );
};

export default AdminPanel;
