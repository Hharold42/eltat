import Link from "next/link";
import User from "../client/User";
import { LogoutButton } from "@/app/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="bg-gray-800 h-14 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex space-x-4">
        <span className="text-white text-lg font-semibold px-3">ТатЭл</span>
        <Link
          href={"/orders"}
          className="text-slate-400 px-3 py-1 hover:text-slate-200"
        >
          Заказы
        </Link>
        <Link
          href={"/orderCreate"}
          className="text-slate-400 px-3 py-1 hover:text-slate-200"
        >
          Новый заказ
        </Link>
      </div>
      <div className="flex space-x-4 text-slate-400">
        {["DEV", "ADMIN"].includes(session?.user?.role) ? (
          <Link
            href={"/admin"}
            className="text-slate-400 px-3 py-1 hover:text-slate-200"
          >
            ADMIN PANEL
          </Link>
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
