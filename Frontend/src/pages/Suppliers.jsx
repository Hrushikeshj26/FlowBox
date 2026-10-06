import React, { useState, useEffect } from "react";
import { Truck, Mail, Phone, Building, Plus, Trash2 } from "lucide-react";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    phone: "",
    category: "",
  });

  // 1. FETCH SUPPLIERS ON MOUNT
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/suppliers");
        if (response.ok) {
          const data = await response.json();
          setSuppliers(data);
        }
      } catch (error) {
        console.error("Failed to fetch suppliers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  // 2. SEND NEW SUPPLIER TO BACKEND
  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Clear form instantly
        setFormData({ name: "", contact: "", phone: "", category: "" });

        // Re-fetch list to guarantee we have the real MongoDB _ids
        const freshRes = await fetch("http://localhost:5000/api/suppliers");
        setSuppliers(await freshRes.json());
      } else {
        const errorData = await response.json();
        alert(`Failed to add supplier: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating supplier:", error);
    }
  };

  // 3. DELETE SUPPLIER FROM BACKEND
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?"))
      return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/suppliers/${id}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setSuppliers(suppliers.filter((s) => s._id !== id));
      } else {
        alert("Failed to delete supplier.");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
          <Truck className="h-7 w-7" /> Suppliers
        </h1>
        <p className="text-sm text-slate-500">
          Manage supply chain contacts and procurement.
        </p>
      </div>

      {/* FORM */}
      <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 pb-4">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            Add Supplier
          </h3>
        </div>
        <div className="p-6 pt-0">
          <form
            onSubmit={handleAddSupplier}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">
                Company
              </label>
              <input
                required
                type="text"
                placeholder="Acme Corp"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">
                Email
              </label>
              <input
                required
                type="email"
                placeholder="email@company.com"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">
                Phone
              </label>
              <input
                required
                type="text"
                placeholder="(555) 000-0000"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">
                Category
              </label>
              <div className="flex gap-2">
                <input
                  required
                  type="text"
                  placeholder="Electronics"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
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

      {/* TABLE */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="h-10 px-4 font-medium text-slate-500">
                  Company
                </th>
                <th className="h-10 px-4 font-medium text-slate-500">
                  Category
                </th>
                <th className="h-10 px-4 font-medium text-slate-500">Email</th>
                <th className="h-10 px-4 font-medium text-slate-500">Phone</th>
                <th className="h-10 px-4 font-medium text-slate-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    Loading suppliers...
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    No suppliers found.
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr
                    key={supplier._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 font-medium text-slate-900 flex items-center gap-2">
                      <Building className="h-4 w-4 text-slate-400" />{" "}
                      {supplier.name}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {supplier.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />{" "}
                        {supplier.contact}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />{" "}
                        {supplier.phone}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(supplier._id)}
                        className="inline-flex p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        title="Delete Supplier"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
