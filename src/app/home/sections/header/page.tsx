"use client";

import {
  Search,
  User,
  Heart,
  Phone,
  Calendar,
  Menu,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeaderCartBadge from "@/components/HeaderCartBadge";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <>
      {/* Promotional Banner */}
      <div className="bg-teal-800 text-white text-center py-2 sm:py-3 px-4">
        <p className="text-xs sm:text-sm font-light tracking-wide">
          <span className="font-medium">ENDS SOON!</span> Receive Natural
          Diamond Studs With Purchase Over $1,000. Use Code{" "}
          <span className="font-semibold tracking-wider">DIAMOND</span> in Cart.
          →
        </p>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Header */}
          <div className="flex items-center justify-between pt-4 sm:py-6 lg:py-8 relative">
            {/* Left - Contact Info */}
            <div className="hidden sm:flex items-center space-x-4 lg:space-x-8 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center space-x-1 sm:space-x-2 hover:text-teal-700 transition-colors cursor-pointer">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-light">800.691.0952</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 hover:text-teal-700 transition-colors cursor-pointer">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-light hidden lg:inline">
                  Virtual Appointment
                </span>
                <span className="font-light lg:hidden">Appointment</span>
              </div>
            </div>

            {/* Center - Logo */}
            <div className="flex-1 flex justify-start sm:justify-center sm:absolute top-0 left-0 right-0 bottom-0 items-center">
              <div className="text-left sm:text-center flex items-center justify-center ">
                <Image
                  src="/images/logoIcon.png"
                  alt="Mevlin Diamonds"
                  width={150}
                  height={150}
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 object-contain"
                />
                <Image
                  src="/images/logoText.png"
                  alt="Mevlin Diamonds"
                  width={150}
                  height={150}
                  className="w-auto h-6 sm:w-12 sm:h-12 lg:w-auto lg:h-8 object-contain sm:mt-2"
                />
                {/* <h1 className="text-lg sm:text-xl lg:text-3xl font-light tracking-[0.1em] sm:tracking-[0.15em] lg:tracking-[0.2em] text-gray-800 mb-1">
                    MEVLIN DIAMONDS<sup className="text-xs">®</sup>
                  </h1> */}
              </div>
            </div>

            {/* Right - User Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-teal-700 transition-colors cursor-pointer " />

              {status === "loading" && (
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted hidden sm:block"></div>
              )}

              {status !== "loading" && (
                <div className="hidden sm:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        {status === "authenticated" && user ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={user.image || undefined}
                              alt={user.name || "User"}
                            />
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <User className="min-h-5 min-w-5 text-gray-600" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 rounded-none"
                      align="end"
                      forceMount
                    >
                      {status === "authenticated" && user ? (
                        <>
                          <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Hello, {user.name}
                              </p>
                              <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/profile">
                              <User className="mr-2 h-4 w-4" />
                              <span>My Profile</span>
                            </Link>
                          </DropdownMenuItem>
                          {isAdmin && (
                            <DropdownMenuItem asChild>
                              <Link href="/admin">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Admin Dashboard</span>
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => signOut()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem asChild>
                          <Link
                            href="/auth/signin"
                            className="w-full justify-center"
                          >
                            Sign In
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-teal-700 transition-colors cursor-pointer hidden sm:block" />
              <HeaderCartBadge />
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-teal-700 transition-colors cursor-pointer sm:hidden" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="pb-3 sm:pb-4 lg:pb-6 pt-1 sm:pt-2">
            <ul className="hidden sm:flex justify-center space-x-8 lg:space-x-16 text-xs sm:text-sm font-light text-gray-700 tracking-wide">
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-1 sm:py-2 border-b-2 border-transparent hover:border-teal-700">
                <Link href="/products">SHOP</Link>
              </li>
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-1 sm:py-2 border-b-2 border-transparent hover:border-teal-700">
                ENGAGEMENT RINGS
              </li>
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-1 sm:py-2 border-b-2 border-transparent hover:border-teal-700">
                WEDDING RINGS
              </li>
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-1 sm:py-2 border-b-2 border-transparent hover:border-teal-700">
                DIAMONDS
              </li>
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-1 sm:py-2 border-b-2 border-transparent hover:border-teal-700">
                GEMSTONES
              </li>
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-1 sm:py-2 border-b-2 border-transparent hover:border-teal-700">
                JEWELRY
              </li>
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-1 sm:py-2 border-b-2 border-transparent hover:border-teal-700">
                GIFTS
              </li>
              <li className="hover:text-teal-700 transition-colors cursor-pointer py-1 sm:py-2 border-b-2 border-transparent hover:border-teal-700">
                ABOUT
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
