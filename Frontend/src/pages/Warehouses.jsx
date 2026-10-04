import React, { useState } from "react";
import { Building2, MapPin, Box, Plus } from "lucide-react";

const initialWarehouses = [
  {
    _id: "w1",
    name: "Downtown Hub",
    location: "New York, NY",
    capacity: 5000,
    currentLoad: 3450,
  },
  {
    _id: "w2",
    name: "Westside Depot",
    location: "Los Angeles, CA",
    capacity: 10000,
    currentLoad: 8900,
  },
];

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  const handleAddWarehouse = (e) => {
    e.preventDefault();
    const newWarehouse = {
      _id: `w_${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      location: formData.location,
      capacity: Number(formData.capacity),
      currentLoad: 0,
    };
    setWarehouses([newWarehouse, ...warehouses]);
    setFormData({ name: "", location: "", capacity: "" });
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {warehouses.map((warehouse) => {
          const loadPercentage = Math.round(
            (warehouse.currentLoad / warehouse.capacity) * 100,
          );
          const isAtCapacity = loadPercentage > 85;

          return (
            <div
              key={warehouse._id}
              className="rounded-xl border border-slate-200 bg-white shadow-sm p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-950">
                    {warehouse.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
                    <MapPin className="h-3.5 w-3.5" /> {warehouse.location}
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                  <Box className="h-4 w-4 text-slate-600" />
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
                  {warehouse.currentLoad} / {warehouse.capacity} items
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
