import AddNewPerformer from "@/components/admin/client/AddNewEmployee";
import AddNewUser from "@/components/admin/client/AddNewUser";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const AdminPanel = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "USER") {
    return <p>deprecated</p>;
  }

  return (
    <div className="container mx-auto p-4 grid grid-cols-2 gap-4">
      <div className="col-span-1 bg-gray-100 p-4 rounded shadow-md">
        <AddNewUser />
      </div>
      <div className="col-span-1 bg-gray-100 p-4 rounded shadow-md">
        <AddNewPerformer /> 
      </div>
    </div>
  );
};

export default AdminPanel;
