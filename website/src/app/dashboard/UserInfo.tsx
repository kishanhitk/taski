"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function UserInfo({ email }) {
  return (
    <div>
      {email}
      <Button variant="outline" onClick={() => signOut()}>
        Logout
      </Button>
    </div>
  );
}
