import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full bg-background dark:bg-background transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
