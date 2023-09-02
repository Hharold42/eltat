"use client";

import { signIn, signOut } from "next-auth/react";

export const LoginButton = () => {
  return <button onClick={() => signIn()}>Sign in</button>;
};

export const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut()}
      className="text-slate-400 px-3 py-1 hover:text-slate-200"
    >
      Выйти
    </button>
  );
};
