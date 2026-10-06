import React from "react";
import { Outlet } from "react-router-dom"; // 1. Import Outlet
import Sidebar from "../components/Sidebar"; // Make sure this path is correct!

export default function Home() {
  return (
    <div className="flex h-screen bg-slate-100 w-full">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7/8 mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
