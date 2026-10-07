import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PackageSearch,
  Building2,
  Truck,
  ShoppingCart,
  Box,
  ArrowRightLeft,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
} from "lucide-react";

import { useTheme } from "./ThemeProvider";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Inventory", path: "/inventory", icon: PackageSearch },
    { name: "Transfers", path: "/transfers", icon: ArrowRightLeft },
    { name: "Orders", path: "/orders", icon: ShoppingCart },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Warehouses", path: "/warehouses", icon: Building2 },
    { name: "Suppliers", path: "/suppliers", icon: Truck },
  ];

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out z-20 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <div
          className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary shrink-0">
            <Box className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground whitespace-nowrap">
            FlowBox
          </span>
        </div>

        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary shrink-0">
              <Box className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : ""}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                } ${isCollapsed ? "justify-center" : "justify-start"}`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && (
                <span className="whitespace-nowrap text-sm">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 border-t border-border flex flex-col gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 shrink-0" />
          ) : (
            <Moon className="h-5 w-5 shrink-0" />
          )}
          {!isCollapsed && (
            <span className="whitespace-nowrap font-medium text-sm">
              Light Mode
            </span>
          )}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5 shrink-0" />
          ) : (
            <PanelLeftClose className="h-5 w-5 shrink-0" />
          )}
          {!isCollapsed && (
            <span className="whitespace-nowrap font-medium text-sm">
              Minimize Menu
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
