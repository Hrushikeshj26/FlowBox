import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PackageSearch,
  Building2,
  Truck,
  ShoppingCart,
  ArrowRightLeft,
  WindArrowUp,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function Sidebar() {
  // 2. Add the Transfers object to the array
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Inventory", path: "/inventory", icon: PackageSearch },
    { name: "Transfers", path: "/transfers", icon: ArrowRightLeft },
    { name: "Orders", path: "/orders", icon: ShoppingCart },
    { name: "Warehouses", path: "/warehouses", icon: Building2 },
    { name: "Suppliers", path: "/suppliers", icon: Truck },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white h-screen flex flex-col sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-600 mr-3">
          <WindArrowUp className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-950">
          FlowBox
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Main Menu
        </p>

        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              buttonVariants({
                variant: isActive ? "secondary" : "ghost",
              }) +
              ` w-full justify-start gap-3 text-sm ${
                isActive
                  ? "bg-slate-100 font-semibold text-indigo-600"
                  : "text-slate-600"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
            HJ
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">
              Admin User
            </span>
            <span className="text-xs text-slate-500">hrushij.dev</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
