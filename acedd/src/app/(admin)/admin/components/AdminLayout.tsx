"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAVIGATION_ITEMS } from "../constants";
import { MembersProvider } from "@/contexts/MembersContext";
import type { AdminRole } from "@/lib/types/admin";
import { logClientError } from "@/lib/utils/clientLogging";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Fetch current admin user on mount
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch("/api/admin/me");
        if (response.ok) {
          const data = await response.json();
          setCurrentAdmin(data.user);
        } else {
          // If not authenticated, redirect to login
          router.push("/admin-login");
        }
      } catch (error) {
        logClientError("[AdminLayout][FETCH_ADMIN]", error);
      }
    };
    
    fetchAdmin();
  }, [router]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/admin-login");
        router.refresh();
      } else {
        logClientError("[AdminLayout][LOGOUT]", new Error("Logout failed"));
        setIsLoggingOut(false);
      }
    } catch (error) {
      logClientError("[AdminLayout][LOGOUT]", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <MembersProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-auto lg:flex-shrink-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {ADMIN_NAVIGATION_ITEMS
              .filter((item) => {
                // Filter menu items based on current admin role
                if (!currentAdmin) return false;
                // SUPER_ADMIN can see everything
                if (currentAdmin.role === "SUPER_ADMIN") return true;
                // Check if current role is in allowed roles
                return item.roles.includes(currentAdmin.role);
              })
              .map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname === item.href
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon size={20} className="mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentAdmin?.name || "Yükleniyor..."}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentAdmin?.email || ""}
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              title="Çıkış Yap"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Son güncelleme: {(() => {
                  const date = new Date();
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = date.getFullYear();
                  return `${day}.${month}.${year}`;
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 min-h-screen">
          {children}
        </main>
      </div>
      </div>
    </MembersProvider>
  );
}
