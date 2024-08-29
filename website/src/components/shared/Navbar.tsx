"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogIn, Menu, X, User, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const UserInfo = ({ email }: { email: string | null | undefined }) => (
    <div className="flex items-center space-x-2 sm:space-x-4 justify-between">
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-sm font-medium inline">{email || "User"}</span>
      </div>
      <Button variant="outline" size="sm" onClick={() => signOut()}>
        <LogOut className="h-4 w-4 mr-2" />
        <span>Logout</span>
      </Button>
    </div>
  );

  return (
    <nav className="bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl sm:text-3xl font-light">Taski</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
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
                <UserInfo email={session.user?.email} />
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

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {session ? (
              <>
                {pathname !== "/dashboard" && (
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <div className="py-2">
                  <UserInfo email={session.user?.email} />
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
