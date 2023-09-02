import Link from "next/link";
import User from "../client/User";
import { LogoutButton } from "@/app/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="bg-gray-800 py-4 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex space-x-4">
        <span className="text-white text-xl font-semibold py-1 px-4">
          ТатЭл
        </span>
        <Link
          href={"/orders"}
          className="text-white border px-4 py-2 rounded-md hover:bg-slate-900"
        >
          Заказы
        </Link>
        <Link
          href={"/orderCreate"}
          className="text-white border px-4 py-2 rounded-md hover:bg-slate-900"
        >
          Создать заказ
        </Link>
      </div>
      <div className="flex space-x-4 [&>*]:text-white">
        {["DEV", "ADMIN"].includes(session?.user?.role) ? (
          <Link href={"/admin"}>ADMIN PANEL</Link>
        ) : (
          <></>
        )}

        <User />
        <LogoutButton />
      </div>
    </div>
  );
};

export default Header;
