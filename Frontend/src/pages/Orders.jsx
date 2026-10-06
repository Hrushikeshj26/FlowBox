import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Trash2, User, Package } from "lucide-react";

// Shadcn Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    customerName: "",
    productId: "",
    quantity: "",
  });

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch("http://localhost:5000/api/orders"),
        fetch("http://localhost:5000/api/products"),
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName,
          productId: formData.productId,
          quantity: Number(formData.quantity),
        }),
      });

      if (response.ok) {
        setFormData({ customerName: "", productId: "", quantity: "" });
        await fetchData();
      } else {
        const errorData = await response.json();
        alert(`Failed to place order: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order? This will return the stock to the warehouse.",
      )
    )
      return;
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "DELETE",
      });
      if (response.ok) await fetchData();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (response.ok) await fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
          <ShoppingCart className="h-7 w-7" /> Orders
        </h1>
        <p className="text-sm text-slate-500">
          Process customer orders and manage fulfillment.
        </p>
      </div>

      {/* ADD ORDER CARD */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Create Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAddOrder}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Name</label>
              <Input
                required
                placeholder="John Doe"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Select Product</label>
              {/* Shadcn Select using onValueChange */}
              <Select
                required
                value={formData.productId}
                onValueChange={(value) =>
                  setFormData({ ...formData, productId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a product..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product._id}
                      value={product._id}
                      disabled={product.stockCount <= 0}
                    >
                      {product.name} - ${(product.price || 0).toFixed(2)} (
                      {product.stockCount} in stock)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex gap-2">
                <Input
                  required
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
                <Button
                  type="submit"
                  size="icon"
                  className="shrink-0 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ORDERS TABLE CARD */}
      <Card className="overflow-hidden p-2">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="w-[160px]">Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-slate-500"
                >
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-slate-500"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const productName = order.product?.name || "Deleted Product";

                return (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-xs text-slate-500 uppercase">
                      {order._id.slice(-6)}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />{" "}
                        {order.customerName}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-slate-400" />
                        {productName}{" "}
                        <span className="text-xs text-slate-400">
                          (x{order.quantity})
                        </span>
                      </div>
                    </TableCell>

                    {/* Inline Status Dropdown with dynamic coloring on the Trigger */}
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order._id, value)
                        }
                      >
                        <SelectTrigger
                          className={`h-8 text-xs font-medium w-full focus:ring-0 ${
                            order.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                              : order.status === "Shipped"
                                ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell className="font-semibold text-slate-700">
                      ${(order.totalPrice || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(order._id)}
                        className="text-slate-400 hover:text-slate-900"
                        title="Cancel Order"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
