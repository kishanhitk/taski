"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import UserInfo from "@/app/dashboard/UserInfo";
import { Home, LayoutDashboard, LogIn, Pen } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="bg-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-3xl font-light">Taski</span>
        </Link>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              {pathname !== "/dashboard" && (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              )}
              {pathname === "/dashboard" && (
                <UserInfo email={session.user?.email} />
              )}
            </>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
