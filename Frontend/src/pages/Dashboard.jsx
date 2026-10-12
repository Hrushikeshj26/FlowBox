import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  DollarSign,
  ShoppingCart,
  Package,
  Truck,
  AlertTriangle,
  Loader2,
  ArrowUpRight,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Shadcn Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_BASE = "http://localhost:5000/api";

// Helper to get headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("flowbox_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const STATUS_COLORS = {
  Pending: "#f59e0b", // Amber
  Processing: "#6366f1", // Indigo
  Shipped: "#06b6d4", // Cyan
  Delivered: "#10b981", // Emerald
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Toggle between "revenue" (Monthly Revenue) and "inventory" (Stock by Product)
  const [barView, setBarView] = useState("revenue");

  // Read logged-in user for personalized header
  const storedUser = localStorage.getItem("flowbox_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = getAuthHeaders();

        const [productsRes, ordersRes, suppliersRes] = await Promise.all([
          fetch(`${API_BASE}/products`, { headers }),
          fetch(`${API_BASE}/orders`, { headers }),
          fetch(`${API_BASE}/suppliers`, { headers }),
        ]);

        // Redirect to login if token is missing or expired
        if (
          productsRes.status === 401 ||
          ordersRes.status === 401 ||
          suppliersRes.status === 401
        ) {
          localStorage.removeItem("flowbox_token");
          localStorage.removeItem("flowbox_user");
          navigate("/login");
          return;
        }

        if (productsRes.ok) setProducts(await productsRes.json());
        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (suppliersRes.ok) setSuppliers(await suppliersRes.json());
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // ───────────────── KPI METRICS ─────────────────
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (Number(order.totalPrice) || 0),
    0,
  );

  const inventoryValue = products.reduce(
    (sum, product) =>
      sum + (Number(product.price) || 0) * (Number(product.stockCount) || 0),
    0,
  );

  const lowStockProducts = products.filter(
    (product) => Number(product.stockCount) < 15,
  );

  const recentOrders = orders.slice(0, 5);

  // ───────────────── CHART 1: MONTHLY REVENUE DATA ─────────────────
  const monthlyRevenueData = useMemo(() => {
    const months = [];
    const now = new Date();

    // Build last 6 months baseline so the chart axes always render cleanly
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("default", { month: "short" });
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        name: label,
        revenue: 0,
      });
    }

    orders.forEach((order) => {
      const date = order.createdAt ? new Date(order.createdAt) : now;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = months.find((m) => m.key === key);
      if (bucket) {
        bucket.revenue += Number(order.totalPrice) || 0;
      } else if (months.length > 0) {
        // Fallback to current month if order has no date
        months[months.length - 1].revenue += Number(order.totalPrice) || 0;
      }
    });

    return months;
  }, [orders]);

  // ───────────────── CHART 1 (ALT): STOCK BY PRODUCT DATA ─────────────────
  const productStockData = useMemo(() => {
    return products.slice(0, 8).map((p) => ({
      name: p.name.length > 12 ? `${p.name.slice(0, 12)}…` : p.name,
      stock: Number(p.stockCount) || 0,
    }));
  }, [products]);

  // ───────────────── CHART 2: ORDER STATUS PIE DATA ─────────────────
  const orderStatusData = useMemo(() => {
    const counts = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
    };

    orders.forEach((order) => {
      const status = order.status || "Pending";
      if (counts[status] !== undefined) {
        counts[status] += 1;
      } else {
        counts.Pending += 1;
      }
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
        color: STATUS_COLORS[name],
      }))
      .filter((item) => item.value > 0);
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {user?.name ? `${user.name}'s Overview` : "Dashboard"}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Real-time summary of your inventory, orders, and supply chain
          performance.
        </p>
      </div>

      {/* ───────────────── KPI CARDS ───────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              $
              {totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="mt-1 flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
              From {orders.length} total orders
            </p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {orders.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Active customer shipments
            </p>
          </CardContent>
        </Card>

        {/* Products in Stock */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Products in Stock
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {products.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Valued at $
              {inventoryValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>

        {/* Active Suppliers */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Suppliers
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Truck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {suppliers.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Verified supply partners
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ───────────────── CHARTS SECTION ───────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Bar Chart Card (Spans 2 columns) */}
        <Card className="border-border bg-card shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-col gap-3 border-b border-border bg-muted/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-4 w-4 text-primary" />
                {barView === "revenue"
                  ? "Monthly Revenue Overview"
                  : "Inventory Stock by Product"}
              </CardTitle>
              <CardDescription>
                {barView === "revenue"
                  ? "Revenue generated over the last 6 months."
                  : "Current unit counts across your top products."}
              </CardDescription>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
              <Button
                type="button"
                variant={barView === "revenue" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => setBarView("revenue")}
              >
                Revenue
              </Button>
              <Button
                type="button"
                variant={barView === "inventory" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => setBarView("inventory")}
              >
                Stock Levels
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {barView === "revenue" ? (
                  <BarChart
                    data={monthlyRevenueData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(148, 163, 184, 0.2)"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#1e293b",
                        borderRadius: "8px",
                        color: "#f8fafc",
                        fontSize: "12px",
                      }}
                      formatter={(value) => [
                        `$${Number(value).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`,
                        "Revenue",
                      ]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#6366f1"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={48}
                    />
                  </BarChart>
                ) : (
                  <BarChart
                    data={
                      productStockData.length > 0
                        ? productStockData
                        : [{ name: "No Products", stock: 0 }]
                    }
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(148, 163, 184, 0.2)"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(6, 182, 212, 0.08)" }}
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#1e293b",
                        borderRadius: "8px",
                        color: "#f8fafc",
                        fontSize: "12px",
                      }}
                      formatter={(value) => [`${value} units`, "Stock"]}
                    />
                    <Bar
                      dataKey="stock"
                      fill="#06b6d4"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={48}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart Card: Order Fulfillment Status */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChartIcon className="h-4 w-4 text-primary" />
              Order Status
            </CardTitle>
            <CardDescription>Real-time fulfillment breakdown.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={
                      orderStatusData.length > 0
                        ? orderStatusData
                        : [
                            {
                              name: "No Orders Yet",
                              value: 1,
                              color: "#cbd5e1",
                            },
                          ]
                    }
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={88}
                    paddingAngle={orderStatusData.length > 1 ? 4 : 0}
                    dataKey="value"
                  >
                    {(orderStatusData.length > 0
                      ? orderStatusData
                      : [{ name: "No Orders Yet", value: 1, color: "#334155" }]
                    ).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "8px",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Status Legend */}
            <div className="mt-2 grid w-full grid-cols-2 gap-2 border-t border-border pt-4 text-xs">
              {Object.entries(STATUS_COLORS).map(([status, color]) => {
                const found = orderStatusData.find((s) => s.name === status);
                const count = found ? found.value : 0;
                return (
                  <div
                    key={status}
                    className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-muted-foreground">{status}</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ───────────────── TABLES SECTION ───────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders Table */}
        <Card className="overflow-hidden border-border bg-card shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <CardDescription>
              The latest 5 orders placed in your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="h-11 font-semibold text-foreground">
                    Customer
                  </TableHead>
                  <TableHead className="h-11 font-semibold text-foreground">
                    Product
                  </TableHead>
                  <TableHead className="h-11 font-semibold text-foreground">
                    Qty
                  </TableHead>
                  <TableHead className="h-11 text-right font-semibold text-foreground">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        Loading recent orders...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No orders recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow
                      key={order._id}
                      className="transition-colors hover:bg-muted/40"
                    >
                      <TableCell className="font-medium text-foreground">
                        <div>{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.customerEmail}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.productId?.name || "Deleted Product"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{order.quantity}x</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        $
                        {(order.totalPrice || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="overflow-hidden border-border bg-card shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Low Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <CardDescription>
              Products with fewer than 15 units remaining.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="h-11 font-semibold text-foreground">
                    Product
                  </TableHead>
                  <TableHead className="h-11 text-right font-semibold text-foreground">
                    Remaining
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="h-24 text-center text-muted-foreground"
                    >
                      <Loader2 className="mx-auto h-4 w-4 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                ) : lowStockProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="h-24 text-center text-muted-foreground"
                    >
                      All stock levels are healthy.
                    </TableCell>
                  </TableRow>
                ) : (
                  lowStockProducts.map((product) => (
                    <TableRow
                      key={product._id}
                      className="transition-colors hover:bg-muted/40"
                    >
                      <TableCell className="font-medium text-foreground">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            product.stockCount === 0
                              ? "border-destructive/30 bg-destructive/10 text-destructive"
                              : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }
                        >
                          {product.stockCount} left
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
