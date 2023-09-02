"use client";

import { useSession } from "next-auth/react";

const User = () => {
  const { data: session } = useSession();

  return (
    <div className="text-slate-400 px-3 py-1">
      {session?.user?.name}
    </div>
  );
};

export default User;
