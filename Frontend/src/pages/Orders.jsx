import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Trash2,
  Package,
  Loader2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  FileX2,
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

// Dynamic styling for status badges
const STATUS_STYLES = {
  Pending: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Processing: "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  Shipped: "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  Delivered: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("flowbox_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const formatCurrency = (value) =>
  `$${(Number(value) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    productId: "",
    quantity: "1",
  });

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

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch (error) {
      console.error("Failed to fetch orders/products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndProducts();
  }, []);

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
          ...formData,
          quantity: Number(formData.quantity),
        }),
      });

      if (res.status === 401) {
        navigate("/auth");
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create order");

      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        productId: "",
        quantity: "1",
      });
      await fetchOrdersAndProducts();
      setCurrentPage(1); // Jump back to page 1 to see new order
    } catch (error) {
      console.error("Error creating order:", error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_ORDERS}/${orderId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401) {
        navigate("/auth");
        return;
      }
      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Cancel this order and restore units to inventory?")) return;
    try {
      const res = await fetch(`${API_ORDERS}/${orderId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        navigate("/auth");
        return;
      }
      if (res.ok) await fetchOrdersAndProducts();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // --- Filtering & Pagination Logic ---
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchesSearch =
          order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.productId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [orders, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-12 pt-2">
      
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/65 pb-6 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Order Management</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Create transactions, manage fulfillment states, and process customer shipments.
          </p>
        </div>
      </div>

      {/* ───────────────── CREATE ORDER CARD ───────────────── */}
      <Card className="overflow-hidden border-border/70 bg-card shadow-sm transition-all hover:shadow-md">
        <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
          <CardTitle className="text-base font-bold">Create New Order</CardTitle>
          <CardDescription className="text-xs">
            Approved orders instantly deduct units from warehouse inventory.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-6">
          <form onSubmit={handleCreateOrder} className="grid grid-cols-1 gap-5 md:grid-cols-12">
            
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Customer Name</label>
              <Input
                required
                placeholder="e.g. John Doe"
                className="h-10 bg-background/50"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Email Address</label>
              <Input
                required
                type="email"
                placeholder="john@example.com"
                className="h-10 bg-background/50"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Phone</label>
              <Input
                required
                placeholder="+1 555-0199"
                className="h-10 bg-background/50"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Product</label>
              <Select
                required
                value={formData.productId}
                onValueChange={(value) => setFormData({ ...formData, productId: value })}
              >
                <SelectTrigger className="h-10 w-full bg-background/50">
                  <SelectValue placeholder="Select inventory..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product._id} value={product._id} disabled={product.stockCount <= 0}>
                      {product.name} ({product.stockCount} in stock)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Qty</label>
              <Input
                required
                type="number"
                min="1"
                placeholder="1"
                className="h-10 bg-background/50"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div className="md:col-span-12 flex justify-end mt-2">
              <Button type="submit" disabled={isSubmitting} className="h-10 px-8 shadow-sm">
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  <><Plus className="mr-2 h-4 w-4" /> Create Order</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ───────────────── ORDERS TABLE DIRECTORY ───────────────── */}
      <div className="space-y-4">
        
        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customers or products..."
              className="pl-9 h-10 w-full bg-card shadow-sm border-border/70"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" /> Filter:
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="h-10 w-[140px] bg-card border-border/70 shadow-sm">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* TABLE CARD */}
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40 border-b border-border/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-12 pl-6 text-xs font-bold uppercase tracking-wider">Customer Details</TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">Order Items</TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">Order Date</TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">Total Value</TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">Fulfillment Status</TableHead>
                  <TableHead className="h-12 pr-6 text-right text-xs font-bold uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-sm font-medium">Loading transactions...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FileX2 className="h-10 w-10 mb-4 opacity-50" />
                        <p className="text-sm font-medium text-foreground">No orders found</p>
                        <p className="text-xs mt-1">Try adjusting your search or filters.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => {
                    const status = order.status || "Pending";
                    return (
                      <TableRow key={order._id} className="transition-colors hover:bg-muted/30">
                        
                        <TableCell className="py-4 pl-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-foreground">
                              {order.customerName}
                            </span>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {order.customerEmail || "N/A"}</span>
                              <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {order.customerPhone || "N/A"}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-muted/50 text-muted-foreground shrink-0">
                              <Package className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col max-w-[180px]">
                              <span className="font-semibold text-sm text-foreground truncate">
                                {order.productId?.name || "Deleted Product"}
                              </span>
                              <span className="text-xs text-muted-foreground mt-0.5">
                                Qty: {order.quantity} units
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                            <Calendar className="h-4 w-4 shrink-0" />
                            {formatDate(order.createdAt)}
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <span className="font-bold text-sm tabular-nums text-foreground">
                            {formatCurrency(order.totalPrice)}
                          </span>
                        </TableCell>

                        <TableCell className="py-4">
                          <Select
                            value={status}
                            onValueChange={(val) => handleStatusChange(order._id, val)}
                          >
                            <SelectTrigger className={`h-8 w-[130px] text-xs font-bold uppercase tracking-wider border transition-colors shadow-none focus:ring-0 ${STATUS_STYLES[status] || STATUS_STYLES.Pending}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending" className="text-amber-600 font-semibold text-xs uppercase tracking-wider">Pending</SelectItem>
                              <SelectItem value="Processing" className="text-indigo-600 font-semibold text-xs uppercase tracking-wider">Processing</SelectItem>
                              <SelectItem value="Shipped" className="text-cyan-600 font-semibold text-xs uppercase tracking-wider">Shipped</SelectItem>
                              <SelectItem value="Delivered" className="text-emerald-600 font-semibold text-xs uppercase tracking-wider">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell className="py-4 pr-6 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteOrder(order._id)}
                            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
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
          </div>

          {/* PAGINATION FOOTER */}
          {!isLoading && filteredOrders.length > 0 && (
            <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-6 py-4">
              <div className="text-xs font-medium text-muted-foreground">
                Showing <span className="font-bold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-foreground">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of <span className="font-bold text-foreground">{filteredOrders.length}</span> orders
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-xs font-semibold px-2">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}