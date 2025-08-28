"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/home/sections/header/page";
import Footer from "@/app/home/sections/footer/page";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Check if the current route is an admin route
  const isAdminRoute = pathname.startsWith("/admin");

  // For admin routes, render children without header/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For all other routes, render with header and footer
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}




