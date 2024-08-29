"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

export default function UserInfo({
  email,
}: {
  email: string | null | undefined;
}) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <User className="h-5 w-5" />
        <span className="text-sm font-medium">{email || "User"}</span>
      </div>
      <Button variant="outline" size="sm" onClick={() => signOut()}>
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
