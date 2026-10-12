import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Trash2,
  Package,
  Loader2,
  User,
  Mail,
  Phone,
} from "lucide-react";

// Shadcn Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const API_ORDERS = "http://localhost:5000/api/orders";
const API_PRODUCTS = "http://localhost:5000/api/products";

// Helper to get headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("flowbox_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    productId: "",
    quantity: "1",
  });

  // 1. Fetch only the logged-in user's orders and available products
  const fetchOrdersAndProducts = async () => {
    try {
      const headers = getAuthHeaders();
      const [ordersRes, productsRes] = await Promise.all([
        fetch(API_ORDERS, { headers }),
        fetch(API_PRODUCTS, { headers }),
      ]);

      if (ordersRes.status === 401 || productsRes.status === 401) {
        navigate("/auth");
        return;
      }

      if (ordersRes.ok) {
        setOrders(await ordersRes.json());
      }
      if (productsRes.ok) {
        setProducts(await productsRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch orders/products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndProducts();
  }, []);

  // 2. Create a new order for the logged-in user
  const handleCreateOrder = async (e) => {
    e.preventDefault();

    if (!formData.productId) {
      alert("Please select a product.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(API_ORDERS, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          productId: formData.productId,
          quantity: Number(formData.quantity),
        }),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        productId: "",
        quantity: "1",
      });

      // Refresh orders and updated product stock counts
      await fetchOrdersAndProducts();
    } catch (error) {
      console.error("Error creating order:", error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_ORDERS}/${orderId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // 4. Delete order & restore stock
  const handleDeleteOrder = async (orderId) => {
    if (
      !window.confirm(
        "Cancel this order and restore the units back to inventory?",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`${API_ORDERS}/${orderId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.ok) {
        await fetchOrdersAndProducts();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
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
          Create customer orders, track fulfillment status, and auto-adjust
          stock.
        </p>
      </div>

      {/* ───────────────── CREATE ORDER CARD ───────────────── */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 pb-4">
          <CardTitle className="text-lg">Create New Order</CardTitle>
          <CardDescription>
            Placing an order automatically deducts units from your inventory.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            onSubmit={handleCreateOrder}
            className="grid grid-cols-1 items-start gap-4 md:grid-cols-5"
          >
            {/* Customer Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Customer Name
              </label>
              <Input
                required
                placeholder="John Doe"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
              />
            </div>

            {/* Customer Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                required
                type="email"
                placeholder="john@company.com"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
              />
            </div>

            {/* Customer Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Phone
              </label>
              <Input
                required
                placeholder="+1 (555) 000-0000"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
              />
            </div>

            {/* Product Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Product
              </label>
              <Select
                required
                value={formData.productId}
                onValueChange={(value) =>
                  setFormData({ ...formData, productId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product._id}
                      value={product._id}
                      disabled={product.stockCount <= 0}
                    >
                      {product.name} ({product.stockCount} in stock)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity + Submit */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Quantity
              </label>
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
                  disabled={isSubmitting}
                  className="shrink-0"
                  aria-label="Create order"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ───────────────── ORDERS TABLE ───────────────── */}
      <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
        <Table>
          <TableHeader className="border-b border-border bg-muted/70 dark:bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-foreground">
                Customer
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Email
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Contact
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Product
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Quantity
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Total Price
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Loading orders...
                  </div>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order._id}
                  className="transition-colors hover:bg-muted/40"
                >
                  {/* Customer Info */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <User className="h-3.5 w-3.5 text-primary" />
                        {order.customerName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{order.customerEmail || "Email Not Provided"}</span>
                    </div>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{order.customerPhone || "Email Not Provided"}</span>
                    </div>
                  </TableCell>

                  {/* Product */}
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <Package className="h-4 w-4 text-primary" />
                      <span>{order.productId?.name || "Deleted Product"}</span>
                    </div>
                  </TableCell>

                  {/* Quantity */}
                  <TableCell>
                    <Badge variant="secondary">{order.quantity} units</Badge>
                  </TableCell>

                  {/* Total Price */}
                  <TableCell className="font-semibold text-foreground">
                    $
                    {(order.totalPrice || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>

                  {/* Status Selector */}
                  <TableCell>
                    <Select
                      value={order.status || "Pending"}
                      onValueChange={(val) =>
                        handleStatusChange(order._id, val)
                      }
                    >
                      <SelectTrigger className="h-8 w-[130px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteOrder(order._id)}
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete order"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
