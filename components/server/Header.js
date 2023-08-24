import Link from "next/link";
import User from "../client/User";
import { LogoutButton } from "@/app/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="z-80 bg-gray-800 py-4 px-6 flex items-center justify-between sticky top-0">
      <div className="flex space-x-4">
        <span className="text-white text-xl font-semibold">ТатЭл</span>
        <Link href={"/orders"} className="text-white hover:underline">
          Заказы
        </Link>
        <Link href={"/orderCreate"} className="text-white hover:underline">
          Создать заказ
        </Link>
      </div>
      <div className="flex space-x-4">
        {["DEV", "ADMIN"].includes(session?.user?.role) ? (
          <Link href={"/admin"}>ADMIN PANEL</Link>
        ) : (
          <></>
        )}

        <LogoutButton />
        <User />
      </div>
    </div>
  );
};

export default Header;
