import React, { useState, useEffect } from "react";
import { Building2, MapPin, Box, Plus, Trash2 } from "lucide-react";

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  // FETCH WAREHOUSES ON MOUNT
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/stores");
        if (response.ok) {
          const data = await response.json();
          setWarehouses(data);
        }
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  // CREATE WAREHOUSE
  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          capacity: Number(formData.capacity),
        }),
      });

      if (response.ok) {
        const newWarehouse = await response.json();
        setWarehouses([newWarehouse, ...warehouses]);
        setFormData({ name: "", location: "", capacity: "" });
      }
    } catch (error) {
      console.error("Failed to add warehouse:", error);
    }
  };

  // DELETE WAREHOUSE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this warehouse?"))
      return;
    try {
      const response = await fetch(`http://localhost:5000/api/stores/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setWarehouses(warehouses.filter((w) => w._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete warehouse:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
          <Building2 className="h-7 w-7" /> Warehouses
        </h1>
        <p className="text-sm text-slate-500">
          Manage physical storage locations and capacity.
        </p>
      </div>

      {/* FORM */}
      <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 pb-4">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            Register Location
          </h3>
        </div>
        <div className="p-6 pt-0">
          <form
            onSubmit={handleAddWarehouse}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">
                Facility Name
              </label>
              <input
                required
                type="text"
                placeholder="North Hub"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">
                Address / City
              </label>
              <input
                required
                type="text"
                placeholder="Chicago, IL"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">
                Max Capacity
              </label>
              <div className="flex gap-2">
                <input
                  required
                  type="number"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* GRID */}
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading warehouses...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warehouses.map((warehouse) => {
            // Fallback to 0 if currentLoad isn't calculated by backend yet
            const currentLoad = warehouse.currentLoad || 0;
            const loadPercentage = Math.round(
              (currentLoad / warehouse.capacity) * 100,
            );
            const isAtCapacity = loadPercentage > 85;

            return (
              <div
                key={warehouse._id}
                className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">
                        {warehouse.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
                        <MapPin className="h-3.5 w-3.5" /> {warehouse.location}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                        <Box className="h-4 w-4 text-slate-600" />
                      </div>
                      <button
                        onClick={() => handleDelete(warehouse._id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-600">
                        Storage Usage
                      </span>
                      <span
                        className={`font-semibold ${isAtCapacity ? "text-slate-900" : "text-indigo-600"}`}
                      >
                        {loadPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${isAtCapacity ? "bg-slate-800" : "bg-indigo-600"}`}
                        style={{ width: `${loadPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-right">
                      {currentLoad} / {warehouse.capacity} items
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
