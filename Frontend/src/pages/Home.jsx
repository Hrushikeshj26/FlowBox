import React from "react";
import { Outlet } from "react-router"; // Imports the router placeholder
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          {/* 
            The Outlet is the magic window. 
            When the URL is '/', React Router injects <Inventory /> here.
            When the URL is '/orders', it swaps it for <Orders /> automatically.
          */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
