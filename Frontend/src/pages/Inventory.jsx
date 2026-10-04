import React, { useState, useEffect } from "react";
import { PackageSearch, Plus, Trash2, MapPin } from "lucide-react";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, storesRes] = await Promise.all([
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/stores"),
        ]);
        setProducts(await productsRes.json());
        setStores(await storesRes.json());
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
        const newProduct = await response.json();
        setProducts([newProduct, ...products]);
        setFormData({ name: "", price: "", stockCount: "", storeId: "" });
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        { method: "DELETE" },
      );
      if (response.ok) setProducts(products.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
          <PackageSearch className="h-7 w-7" /> Inventory
        </h1>
        <p className="text-sm text-slate-500">
          Manage catalog and stock levels.
        </p>
      </div>

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
                  {stores?.map((store) => (
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

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading inventory data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-slate-950 truncate">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    ${product.price}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                    Stock: {product.stockCount}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 flex items-center gap-1 truncate">
                  <MapPin className="h-3 w-3" />{" "}
                  {product.storeId?.name || "Unassigned"}
                </div>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
