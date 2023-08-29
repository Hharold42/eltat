"use client";

import { signIn, signOut } from "next-auth/react";

export const LoginButton = () => {
  return <button onClick={() => signIn()}>Sign in</button>;
};

export const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut()}
      className="text-white border px-4 py-2 rounded-md hover:bg-slate-900"
    >
      Выйти
    </button>
  );
};
