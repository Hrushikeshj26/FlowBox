import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Pages & Layout
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Warehouses from "./pages/Warehouses";
import Orders from "./pages/Orders";
import Suppliers from "./pages/Suppliers";
import Customers from "./pages/Customers";
import Transfers from "./pages/Transfers";

// 1. Guard for Main App Pages (Only accessible when LOGGED IN)
const ProtectedRoute = () => {
  const token = localStorage.getItem("flowbox_token");
  return token ? <Outlet /> : <Navigate to="/landing" replace />;
};

// 2. Guard for Landing & Auth Pages (Only accessible when LOGGED OUT)
const PublicRoute = () => {
  const token = localStorage.getItem("flowbox_token");
  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default function App() {
  return (
    <Routes>
      {/* ─── PUBLIC ROUTES (Logged-Out Users Only) ─── */}
      <Route element={<PublicRoute />}>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
      </Route>

      {/* ─── PROTECTED ROUTES (Logged-In Users Only) ─── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="warehouses" element={<Warehouses />} />
          <Route path="orders" element={<Orders />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path="customers" element={<Customers />} />
          <Route path="suppliers" element={<Suppliers />} />
        </Route>
      </Route>

      {/* ─── CATCH-ALL FALLBACK ─── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
