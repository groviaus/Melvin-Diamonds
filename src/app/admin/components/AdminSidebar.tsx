"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  HomeIcon,
  PackageIcon,
  UsersIcon,
  SettingsIcon,
  BarChart3Icon,
  ShoppingCartIcon,
  FolderIcon,
  LogOutIcon,
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: HomeIcon,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: PackageIcon,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderIcon,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCartIcon,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: UsersIcon,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3Icon,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: SettingsIcon,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div className="font-semibold">Maven Diamonds</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOutIcon className="w-4 h-4" />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarTrigger />
    </Sidebar>
  );
}
