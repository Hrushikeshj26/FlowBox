import React from "react";
import { NavLink } from "react-router";
import {
  Package,
  ShoppingCart,
  Warehouse,
  LayoutDashboard,
  Truck,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { id: "dashboard", path: "/", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", path: "/inventory", label: "Inventory", icon: Package },
    { id: "orders", path: "/orders", label: "Orders", icon: ShoppingCart },
    {
      id: "warehouses",
      path: "/warehouses",
      label: "Warehouses",
      icon: Warehouse,
    },
    { id: "suppliers", path: "/suppliers", label: "Suppliers", icon: Truck },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <div className="w-8 h-8 bg-indigo-600 text-white rounded-md flex items-center justify-center font-bold mr-3 shadow-sm">
          F
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-950">
          FlowBox
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors text-sm font-medium">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}
