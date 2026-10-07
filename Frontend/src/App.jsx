import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import Warehouses from "./pages/Warehouses";
import Suppliers from "./pages/Suppliers";
import Transfers from "./pages/Transfers";
import Customers from "./pages/Customers";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />

      {/* Private App Routes */}
      <Route path="/" element={<Home />}>
        <Route index element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="orders" element={<Orders />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="warehouses" element={<Warehouses />} />
        <Route path="transfers" element={<Transfers />} />
        <Route path="Customers" element={<Customers />} />
      </Route>
    </Routes>
  );
};

export default App;
