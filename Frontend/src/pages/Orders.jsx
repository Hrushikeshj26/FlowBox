import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Plus,
  Mail,
  Phone,
  Package,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    productId: "",
    quantity: 1,
  });

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch("http://localhost:5000/api/orders"),
        fetch("http://localhost:5000/api/products"),
      ]);

      if (ordersRes.ok) {
        setOrders(await ordersRes.json());
      }

      if (productsRes.ok) {
        setProducts(await productsRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
        }),
      });

      if (response.ok) {
        setFormData({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          productId: "",
          quantity: 1,
        });

        await fetchData();
      } else {
        const errorData = await response.json();

        alert(`Error creating order: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      if (response.ok) {
        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: newStatus,
                }
              : order,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* ───────────────── HEADER ───────────────── */}

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShoppingCart className="h-5 w-5" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Orders
          </h1>
        </div>

        <p className="text-sm text-muted-foreground">
          Process new sales, track fulfillment, and capture customer data.
        </p>
      </div>

      {/* ───────────────── CREATE ORDER ───────────────── */}

      <Card>
        <CardHeader className="border-b border-border bg-muted/30 pb-4">
          <CardTitle className="text-lg">Create New Order</CardTitle>

          <CardDescription>
            Customer details will automatically be saved to the CRM.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-6"
          >
            {/* Customer Name */}

            <div className="space-y-2 lg:col-span-1">
              <label className="text-sm font-medium text-foreground">
                Customer Name
              </label>

              <Input
                required
                placeholder="John Doe"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerName: e.target.value,
                  })
                }
                className="bg-background"
              />
            </div>

            {/* Email */}

            <div className="space-y-2 lg:col-span-1">
              <label className="text-sm font-medium text-foreground">
                Email Address
              </label>

              <Input
                type="email"
                placeholder="john@example.com"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerEmail: e.target.value,
                  })
                }
                className="bg-background"
              />
            </div>

            {/* Phone */}

            <div className="space-y-2 lg:col-span-1">
              <label className="text-sm font-medium text-foreground">
                Phone Number
              </label>

              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerPhone: e.target.value,
                  })
                }
                className="bg-background"
              />
            </div>

            {/* Product */}

            <div className="space-y-2 lg:col-span-2">
              <label className="text-sm font-medium text-foreground">
                Select Product
              </label>

              <Select
                required
                value={formData.productId}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    productId: value,
                  })
                }
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Choose product..." />
                </SelectTrigger>

                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product._id}
                      value={product._id}
                      disabled={product.stockCount <= 0}
                    >
                      {product.name} ({product.stockCount} left)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}

            <div className="space-y-2 lg:col-span-1">
              <label className="text-sm font-medium text-foreground">
                Quantity
              </label>

              <Input
                required
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: e.target.value,
                  })
                }
                className="bg-background"
              />
            </div>

            {/* Submit */}

            <div className="flex items-end lg:col-span-full">
              <Button
                type="submit"
                disabled={isSubmitting || products.length === 0}
                className="h-10 w-full sm:w-1/2 lg:w-1/4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Order
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ───────────────── ORDERS TABLE ───────────────── */}

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <div>
            <CardTitle className="text-lg">Order Directory</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              View and manage your recent sales and fulfillment status.
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            {/* Distinct table header */}

            <TableHeader className="bg-secondary/70 dark:bg-secondary/50">
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="h-11 font-semibold text-foreground">
                  Customer Info
                </TableHead>

                <TableHead className="h-11 font-semibold text-foreground">
                  Item Purchased
                </TableHead>

                <TableHead className="h-11 font-semibold text-foreground">
                  Order Date
                </TableHead>

                <TableHead className="h-11 font-semibold text-foreground">
                  Fulfillment Status
                </TableHead>

                <TableHead className="h-11 text-right font-semibold text-foreground">
                  Total Amount
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Loading */}

              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      Loading order history...
                    </div>
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                /* Empty */

                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No orders have been placed yet.
                  </TableCell>
                </TableRow>
              ) : (
                [...orders].reverse().map((order) => (
                  <TableRow
                    key={order._id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    {/* Customer */}

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {order.customerName}
                        </span>

                        <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
                          {order.customerEmail && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {order.customerEmail}
                            </span>
                          )}

                          {order.customerPhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {order.customerPhone}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Product */}

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Package className="h-4 w-4" />
                        </div>

                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {order.productId?.name || "Deleted Product"}
                          </span>

                          <span className="text-xs text-muted-foreground">
                            Qty: {order.quantity}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Date */}

                    <TableCell className="text-sm text-muted-foreground">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "Just now"}
                    </TableCell>

                    {/* Status */}

                    <TableCell>
                      <Select
                        value={order.status || "Pending"}
                        onValueChange={(value) =>
                          handleStatusChange(order._id, value)
                        }
                      >
                        <SelectTrigger
                          className={`h-8 w-[130px] border-0 text-xs font-semibold shadow-none focus:ring-0 ${
                            order.status === "Pending"
                              ? "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
                              : order.status === "Shipped"
                                ? "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                                : "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
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

                    {/* Amount */}

                    <TableCell className="text-right">
                      <span className="font-bold text-foreground">
                        $
                        {(order.totalPrice || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
