"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "@/app/actions";
import { LayoutDashboard, Tag, ClipboardList, Settings, Inbox, LogOut, Shirt, FileText, Monitor, MessageSquare } from "lucide-react";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await adminLogout();
    router.refresh();
    router.push("/admin/login");
  };

  // Skip rendering navigation for the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const menuItems = [
    { name: "ANALYTICS", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "HERO BANNER", href: "/admin/hero-slides", icon: Monitor },
    { name: "PRODUCTS", href: "/admin/products", icon: Shirt },
    { name: "CATEGORIES", href: "/admin/categories", icon: Tag },
    { name: "ORDERS", href: "/admin/orders", icon: ClipboardList },
    { name: "REVIEWS", href: "/admin/reviews", icon: MessageSquare },
    { name: "INQUIRIES", href: "/admin/inquiries", icon: Inbox },
    { name: "CMS SETTINGS", href: "/admin/settings", icon: Settings },
    { name: "EDITORIALS", href: "/admin/blogs", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-body">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-card-dark sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/admin/dashboard" className="font-display text-xl font-black tracking-widest text-white">
                BLVCK CORE <span className="text-stroke-white select-none">ADMIN</span>
              </Link>
              <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 font-display tracking-widest">
                v1.0.0
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-white/50 hover:text-white text-xs font-display tracking-widest transition-colors uppercase cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">LOGOUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Panel Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar Panel */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <nav className="flex md:flex-col flex-wrap md:space-y-1 gap-1 md:gap-0">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3.5 text-xs font-display tracking-widest transition-all ${
                    isActive
                      ? "bg-white text-black font-black"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Quick Link to storefront */}
            <Link
              href="/"
              target="_blank"
              className="flex items-center space-x-3 px-4 py-3.5 text-xs font-display tracking-widest text-white/30 hover:text-white border-t border-white/5 mt-4"
            >
              <span>VIEW FRONTEND &rarr;</span>
            </Link>
          </nav>
        </aside>

        {/* Workspace panel content */}
        <main className="flex-1 bg-card-dark border border-white/5 p-6 md:p-8 overflow-x-hidden min-h-[70vh]">
          {children}
        </main>
      </div>
    </div>
  );
}
