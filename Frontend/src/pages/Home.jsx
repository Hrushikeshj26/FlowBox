import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Home() {
  // Set the default tab to 'inventory'
  const [activeTab, setActiveTab] = useState("inventory");

  // A simple function to render different content based on the selected tab
  const renderContent = () => {
    switch (activeTab) {
      case "inventory":
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Inventory Management
            </h1>
            <p className="text-gray-500 mb-8">
              Manage your warehouse stock and products.
            </p>
            {/* 
              You will eventually move the grid and form code from your App.jsx 
              into a new <InventoryTab /> component and render it here.
            */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-500">
                Inventory components will load here...
              </p>
            </div>
          </div>
        );
      case "orders":
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
            <p className="text-gray-500 mb-8">
              Process customer orders and deduct stock.
            </p>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-500">Order interface coming soon.</p>
            </div>
          </div>
        );
      case "warehouses":
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Warehouses
            </h1>
            <p className="text-gray-500 mb-8">
              Manage your physical store locations.
            </p>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-500">
                Warehouse configuration coming soon.
              </p>
            </div>
          </div>
        );
      default:
        return <div>Select a tab from the sidebar.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. The Sidebar remains fixed on the left */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. The Main Content Area */}
      {/* We add ml-64 to push the content right, so the 64-width fixed sidebar doesn't cover it */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
}
