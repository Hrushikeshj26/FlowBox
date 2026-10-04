import React, { useState } from "react";
import { ShoppingCart, CheckCircle2, Clock, Package, Plus } from "lucide-react";

const dummyProducts = [
  { _id: "p1", name: "Mechanical Keyboard", price: 120, stockCount: 45 },
  { _id: "p2", name: "Wireless Mouse", price: 60, stockCount: 12 },
  { _id: "p3", name: "27-inch Monitor", price: 300, stockCount: 5 },
];

const initialOrders = [
  {
    _id: "ord1",
    customerName: "Alice Johnson",
    productName: "Mechanical Keyboard",
    quantity: 2,
    status: "Shipped",
    date: "2026-10-04",
  },
  {
    _id: "ord2",
    customerName: "Bob Smith",
    productName: "27-inch Monitor",
    quantity: 1,
    status: "Processing",
    date: "2026-10-03",
  },
];

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [formData, setFormData] = useState({
    customerName: "",
    productId: "",
    quantity: 1,
  });

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const selectedProduct = dummyProducts.find(
      (p) => p._id === formData.productId,
    );
    const newOrder = {
      _id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      customerName: formData.customerName,
      productName: selectedProduct.name,
      quantity: Number(formData.quantity),
      status: "Processing",
      date: new Date().toISOString().split("T")[0],
    };
    setOrders([newOrder, ...orders]);
    setFormData({ customerName: "", productId: "", quantity: 1 });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Orders
        </h1>
        <p className="text-sm text-slate-500">
          Manage customer orders and fulfill inventory.
        </p>
      </div>

      {/* SHADCN-STYLE CARD (Form) */}
      <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 pb-4">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            Create Order
          </h3>
          <p className="text-sm text-slate-500">
            Manually enter a new customer transaction.
          </p>
        </div>

        <div className="p-6 pt-0">
          <form
            onSubmit={handleCreateOrder}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          >
            <div className="md:col-span-4 space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">
                Customer Name
              </label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-5 space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">
                Product
              </label>
              <select
                required
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all"
                value={formData.productId}
                onChange={(e) =>
                  setFormData({ ...formData, productId: e.target.value })
                }
              >
                <option value="" disabled>
                  Select product...
                </option>
                {dummyProducts.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} — ${product.price} ({product.stockCount} in
                    stock)
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">
                Quantity
              </label>
              <div className="flex gap-3">
                <input
                  required
                  type="number"
                  min="1"
                  className="flex h-10 w-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* SHADCN-STYLE LIST */}
      <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 pb-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            Recent Orders
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between p-4 px-6 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                  <Package className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none text-slate-900">
                    {order.customerName}
                  </p>
                  <p className="text-sm text-slate-500 mt-1.5">
                    {order.quantity} × {order.productName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  {order.date}
                </div>

                {/* Shadcn Badge Styling */}
                <div
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                    order.status === "Shipped"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  {order.status === "Shipped" ? (
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                  ) : (
                    <Clock className="mr-1 h-3 w-3" />
                  )}
                  {order.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
