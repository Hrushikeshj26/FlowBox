import React, { useState, useEffect } from "react";
import { PackageSearch, Plus, Trash2, MapPin, Package } from "lucide-react";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stockCount: "",
    storeId: "",
  });

  // 1. FETCH DATA FROM BACKEND ON LOAD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, storesRes] = await Promise.all([
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/stores"),
        ]);

        if (productsRes.ok) setProducts(await productsRes.json());
        if (storesRes.ok) setStores(await storesRes.json());
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. SEND NEW PRODUCT TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          stockCount: Number(formData.stockCount),
          storeId: formData.storeId,
        }),
      });

      if (response.ok) {
        setFormData({ name: "", price: "", stockCount: "", storeId: "" });

        const freshProductsRes = await fetch(
          "http://localhost:5000/api/products",
        );
        const freshProducts = await freshProductsRes.json();
        setProducts(freshProducts);
      } else {
        alert("Failed to add product to database.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // 3. DELETE PRODUCT FROM BACKEND
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        // Remove from UI instantly
        setProducts(products.filter((p) => p._id !== productId));
      } else {
        alert("Failed to delete product from database.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
          <PackageSearch className="h-7 w-7" /> Inventory
        </h1>
        <p className="text-sm text-slate-500">
          Manage catalog and stock levels.
        </p>
      </div>

      {/* ADD PRODUCT FORM */}
      <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 pb-4">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            Add Product
          </h3>
        </div>

        <div className="p-6 pt-0">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">
                Product Name
              </label>
              <input
                required
                type="text"
                placeholder="Name"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">
                Price
              </label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">
                Stock Count
              </label>
              <input
                required
                type="number"
                placeholder="0"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                value={formData.stockCount}
                onChange={(e) =>
                  setFormData({ ...formData, stockCount: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">
                Location
              </label>
              <div className="flex gap-2">
                <select
                  required
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  value={formData.storeId}
                  onChange={(e) =>
                    setFormData({ ...formData, storeId: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  {stores.map((store) => (
                    <option key={store._id} value={store._id}>
                      {store.name}
                    </option>
                  ))}
                </select>
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

      {/* PRODUCT TABLE */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="h-10 px-4 font-medium text-slate-500">
                  Product Name
                </th>
                <th className="h-10 px-4 font-medium text-slate-500">Price</th>
                <th className="h-10 px-4 font-medium text-slate-500">Stock</th>
                <th className="h-10 px-4 font-medium text-slate-500">
                  Location
                </th>
                <th className="h-10 px-4 font-medium text-slate-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    Loading inventory...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    No products in inventory.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  // Safety check: Handles both populated mongoose objects or raw IDs
                  const storeName =
                    product.storeId?.name ||
                    stores.find((s) => s._id === product.storeId)?.name ||
                    "Unassigned";

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 font-medium text-slate-950 flex items-center gap-3">
                        <Package className="h-4 w-4 text-slate-400" />
                        {product.name}
                      </td>
                      <td className="p-4 text-slate-600">
                        ${(product.price || 0).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {product.stockCount} units
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />{" "}
                          {storeName}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="inline-flex p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
