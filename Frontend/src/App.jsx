import { BrowserRouter, Routes, Route } from "react-router"; // (or 'react-router-dom' depending on your version)
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import Warehouses from "./pages/Warehouses";
import Suppliers from "./pages/Suppliers";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />

        <Route path="/" element={<Home />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="warehouses" element={<Warehouses />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
