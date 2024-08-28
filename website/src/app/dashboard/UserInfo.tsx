"use client";
import { signOut } from "next-auth/react";

export default function UserInfo({ email }) {
  return (
    <div>
      {email}
      <button
        onClick={() => signOut()}
        className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
