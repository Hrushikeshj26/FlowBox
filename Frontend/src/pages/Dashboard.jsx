import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  Truck,
  AlertTriangle,
  Loader2,
  TrendingUp,
  Boxes,
  RefreshCw,
  CalendarDays,
  Activity,
  CircleDollarSign,
  PackageX,
  XCircle,
  ArrowRight,
  Building2,
} from "lucide-react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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
const CHART_COLOR = "var(--primary)";

const STATUS_COLORS = {
  Pending: "#f59e0b",
  Processing: "#6366f1",
  Shipped: "#06b6d4",
  Delivered: "#10b981",
};

const STATUS_STYLES = {
  Pending:
    "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Processing:
    "border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  Shipped: "border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  Delivered:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("flowbox_token")}`,
});

const normalizeList = (data, keys = []) => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  for (const key of keys) {
    if (Array.isArray(data[key])) return data[key];
  }
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.results)) return data.results;
  return [];
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("flowbox_user") || "null");
  } catch {
    return null;
  }
};

const formatCurrency = (value) =>
  `$${(Number(value) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatCompactCurrency = (value) =>
  `$${(Number(value) || 0).toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  })}`;

const formatDate = (date) => {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getOrderStatus = (status) => {
  const normalized = String(status || "Pending").toLowerCase();
  return (
    Object.keys(STATUS_COLORS).find(
      (item) => item.toLowerCase() === normalized,
    ) || "Pending"
  );
};

const MetricCard = ({ title, value, description, icon: Icon, loading }) => (
  <Card className="group overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
        ) : (
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        )}
        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {description}
        </p>
      </div>
    </CardContent>
  </Card>
);

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
      <Icon className="h-6 w-6 text-muted-foreground" />
    </div>
    <p className="text-sm font-semibold text-foreground">{title}</p>
    <p className="mt-1 max-w-[250px] text-xs leading-relaxed text-muted-foreground">
      {description}
    </p>
  </div>
);

const ChartTooltip = ({ active, payload, label, currency = false }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2.5 shadow-lg">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-bold text-foreground">
        {currency
          ? formatCurrency(payload[0].value)
          : `${Number(payload[0].value).toLocaleString()} units`}
      </p>
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Expanded state to catch both Company Logo and Admin Profile Photo
  const [brand, setBrand] = useState({ name: "FlowBox", logo: "", avatar: "" });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [chartView, setChartView] = useState("inventory");

  const user = getStoredUser();

  const fetchDashboardData = useCallback(
    async (refresh = false) => {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError("");

      try {
        const headers = getAuthHeaders();
        const responses = await Promise.all([
          fetch(`${API_BASE}/products`, { headers }),
          fetch(`${API_BASE}/orders`, { headers }),
          fetch(`${API_BASE}/suppliers`, { headers }),
          fetch(`${API_BASE}/settings`, { headers }), // Fetch settings for branding
        ]);

        if (responses.some((res) => res.status === 401)) {
          localStorage.removeItem("flowbox_token");
          localStorage.removeItem("flowbox_user");
          navigate("/login");
          return;
        }

        const data = await Promise.all(
          responses.map((res) => (res.ok ? res.json() : Promise.resolve([]))),
        );

        setProducts(normalizeList(data[0], ["products", "items"]));
        setOrders(normalizeList(data[1], ["orders", "items"]));
        setSuppliers(normalizeList(data[2], ["suppliers", "items"]));

        // Populate Branding (Grabs both logo and avatar)
        const settingsData = data[3] || {};
        setBrand({
          name: settingsData.companyName || "FlowBox",
          logo: settingsData.companyLogo || "",
          avatar: settingsData.adminAvatar || "",
        });

        if (responses.slice(0, 3).some((res) => !res.ok)) {
          setError("Some dashboard information could not be loaded.");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Unable to connect to the server. Please try again.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [navigate],
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const totalRevenue = useMemo(
    () =>
      orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0),
    [orders],
  );

  const inventoryValue = useMemo(
    () =>
      products.reduce(
        (sum, product) =>
          sum +
          (Number(product.price) || 0) * (Number(product.stockCount) || 0),
        0,
      ),
    [products],
  );

  const totalStockUnits = useMemo(
    () =>
      products.reduce(
        (sum, product) => sum + (Number(product.stockCount) || 0),
        0,
      ),
    [products],
  );

  const lowStockProducts = useMemo(
    () =>
      products
        .filter((product) => Number(product.stockCount) < 15)
        .sort((a, b) => Number(a.stockCount || 0) - Number(b.stockCount || 0)),
    [products],
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        )
        .slice(0, 5),
    [orders],
  );

  const monthlyRevenueData = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${date.getFullYear()}-${date.getMonth()}`,
        name: date.toLocaleString("default", { month: "short" }),
        revenue: 0,
      });
    }

    orders.forEach((order) => {
      if (!order.createdAt) return;
      const date = new Date(order.createdAt);
      if (Number.isNaN(date.getTime())) return;
      const bucket = months.find(
        (month) => month.key === `${date.getFullYear()}-${date.getMonth()}`,
      );
      if (bucket) bucket.revenue += Number(order.totalPrice) || 0;
    });
    return months;
  }, [orders]);

  const productStockData = useMemo(
    () =>
      [...products]
        .sort((a, b) => Number(b.stockCount || 0) - Number(a.stockCount || 0))
        .slice(0, 8)
        .map((product) => ({
          name:
            product.name?.length > 13
              ? `${product.name.slice(0, 13)}…`
              : product.name || "Unnamed",
          stock: Number(product.stockCount) || 0,
        })),
    [products],
  );

  const orderStatusData = useMemo(() => {
    const counts = { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0 };
    orders.forEach((order) => {
      counts[getOrderStatus(order.status)] += 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name],
    }));
  }, [orders]);

  const totalOrdersInChart = orderStatusData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-full space-y-6 pb-10 max-w-[1600px] mx-auto">
      {/* ───────────────── PREMIUM HERO SECTION WITH LOGO ───────────────── */}
      <section className="relative isolate overflow-hidden rounded-2xl bg-[#102b2b] px-6 py-7 text-white shadow-lg sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full border-[40px] border-white/[0.04]" />
        <div className="pointer-events-none absolute -bottom-36 right-40 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            {/* Dynamic Branding Header (Logo -> Avatar -> Icon) */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-1 shadow-lg backdrop-blur-md">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt="Company Logo"
                    className="h-full w-full rounded-xl object-contain bg-white/10"
                  />
                ) : brand.avatar ? (
                  <img
                    src={brand.avatar}
                    alt="Admin Profile"
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  <Building2 className="h-7 w-7 text-teal-100" />
                )}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1.5 text-xs font-medium text-teal-300">
                <Activity className="h-3.5 w-3.5" />
                {brand.name} Workspace
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {greeting}
              {user?.name ? `, ${user.name}` : ""}!
            </h1>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-teal-100/70">
              Here's what's happening with your inventory and orders. Keep track
              of your business performance in one place.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-teal-100/60">
              <CalendarDays className="h-4 w-4" />
              {today}
              <span className="mx-1 h-1 w-1 rounded-full bg-teal-300/50" />
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live Network Status
              </span>
            </div>
          </div>

          <Button
            onClick={() => fetchDashboardData(true)}
            disabled={isLoading || isRefreshing}
            className="h-10 shrink-0 gap-2 border border-white/15 bg-white/10 text-white shadow-none hover:bg-white/20"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh data
          </Button>
        </div>
      </section>

      {/* ERROR BANNER */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 sm:flex-row sm:items-center sm:justify-between text-destructive">
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => fetchDashboardData(true)}
          >
            Retry Connection
          </Button>
        </div>
      )}

      {/* REFINED KPI SECTION */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          description={`${orders.length} lifetime orders`}
          icon={CircleDollarSign}
          loading={isLoading}
        />
        <MetricCard
          title="Total Inventory Value"
          value={formatCurrency(inventoryValue)}
          description={`${totalStockUnits.toLocaleString()} total units in stock`}
          icon={Package}
          loading={isLoading}
        />
        <MetricCard
          title="Active Products"
          value={products.length.toLocaleString()}
          description={`Supplied by ${suppliers.length} vendors`}
          icon={Boxes}
          loading={isLoading}
        />
        <MetricCard
          title="Low Stock Alerts"
          value={lowStockProducts.length.toLocaleString()}
          description="Items requiring restock"
          icon={AlertTriangle}
          loading={isLoading}
        />
      </section>

      {/* ANALYTICS SECTION */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* MAIN CHART */}
        <Card className="col-span-1 rounded-2xl border-border shadow-sm xl:col-span-2">
          <CardHeader className="flex flex-col gap-4 border-b border-border/50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-bold">
                {chartView === "inventory"
                  ? "Inventory Distribution"
                  : "Revenue Timeline"}
              </CardTitle>
              <CardDescription className="mt-1">
                {chartView === "inventory"
                  ? "Top products by stock volume"
                  : "Gross revenue over the last 6 months"}
              </CardDescription>
            </div>
            <div className="flex w-fit items-center gap-1 rounded-lg bg-muted p-1 border border-border">
              <Button
                size="sm"
                variant={chartView === "inventory" ? "secondary" : "ghost"}
                onClick={() => setChartView("inventory")}
                className="h-8 rounded-md px-3 text-xs font-semibold"
              >
                <Boxes className="mr-1.5 h-3.5 w-3.5" />
                Volume
              </Button>
              <Button
                size="sm"
                variant={chartView === "revenue" ? "secondary" : "ghost"}
                onClick={() => setChartView("revenue")}
                className="h-8 rounded-md px-3 text-xs font-semibold"
              >
                <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                Revenue
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-5 pt-6 sm:px-6">
            {isLoading ? (
              <div className="flex h-[320px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : chartView === "revenue" ? (
              monthlyRevenueData.every((item) => item.revenue === 0) ? (
                <EmptyState
                  icon={TrendingUp}
                  title="No revenue data"
                  description="Sales analytics will appear here."
                />
              ) : (
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyRevenueData}
                      margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--border)"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        width={65}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        tickFormatter={formatCompactCurrency}
                      />
                      <Tooltip
                        content={<ChartTooltip currency />}
                        cursor={{ stroke: "var(--muted)", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke={CHART_COLOR}
                        strokeWidth={3}
                        dot={{ r: 4, fill: CHART_COLOR, strokeWidth: 0 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )
            ) : productStockData.length === 0 ? (
              <EmptyState
                icon={Package}
                title="Empty inventory"
                description="Add products to see distribution."
              />
            ) : (
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productStockData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      dy={10}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      width={45}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                    />
                    <Bar
                      dataKey="stock"
                      fill={CHART_COLOR}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ORDER STATUS PIE CHART */}
        <Card className="col-span-1 rounded-2xl border-border shadow-sm">
          <CardHeader className="border-b border-border/50 px-6 py-5">
            <CardTitle className="text-base font-bold">
              Fulfillment Status
            </CardTitle>
            <CardDescription className="mt-1">
              Pipeline across all active orders
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex h-[280px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="relative mx-auto h-[220px] max-w-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={
                          totalOrdersInChart
                            ? orderStatusData.filter((item) => item.value > 0)
                            : [
                                {
                                  name: "No orders",
                                  value: 1,
                                  color: "var(--muted)",
                                },
                              ]
                        }
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {(totalOrdersInChart
                          ? orderStatusData.filter((item) => item.value > 0)
                          : [{ color: "var(--muted)" }]
                        ).map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold tracking-tight">
                      {totalOrdersInChart}
                    </span>
                    <span className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Orders
                    </span>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {Object.entries(STATUS_COLORS).map(([status, color]) => {
                    const count =
                      orderStatusData.find((item) => item.name === status)
                        ?.value || 0;
                    const percentage = totalOrdersInChart
                      ? (count / totalOrdersInChart) * 100
                      : 0;
                    return (
                      <div key={status}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-sm"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm font-medium text-foreground">
                              {status}
                            </span>
                          </div>
                          <span className="text-sm font-bold">{count}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      {/* OPERATIONS SECTION */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* RECENT ORDERS TABLE */}
        <Card className="col-span-1 rounded-2xl border-border shadow-sm xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 px-6 py-5">
            <div>
              <CardTitle className="text-base font-bold">
                Recent Orders
              </CardTitle>
              <CardDescription className="mt-1">
                Latest transactions needing fulfillment
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-xs font-semibold"
              onClick={() => navigate("/orders")}
            >
              View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : recentOrders.length === 0 ? (
              <EmptyState
                icon={ShoppingCart}
                title="No active orders"
                description="Customer transactions will populate here."
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border">
                      <TableHead className="h-11 pl-6 text-xs font-bold uppercase tracking-wider">
                        Customer
                      </TableHead>
                      <TableHead className="h-11 text-xs font-bold uppercase tracking-wider">
                        Item
                      </TableHead>
                      <TableHead className="h-11 text-xs font-bold uppercase tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="h-11 pr-6 text-right text-xs font-bold uppercase tracking-wider">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order, index) => {
                      const status = getOrderStatus(order.status);
                      return (
                        <TableRow
                          key={order._id || index}
                          className="transition-colors hover:bg-muted/30"
                        >
                          <TableCell className="py-4 pl-6">
                            <div className="font-semibold text-foreground text-sm">
                              {order.customerName || "Unknown"}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {order.customerEmail || "—"}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="font-medium text-foreground text-sm truncate max-w-[180px]">
                              {order.productId?.name || "Deleted Product"}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {formatDate(order.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant="outline"
                              className={`rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[status]}`}
                            >
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 pr-6 text-right text-sm font-bold tabular-nums text-foreground">
                            {formatCurrency(order.totalPrice)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* LOW STOCK ALERTS */}
        <Card className="col-span-1 rounded-2xl border-border shadow-sm flex flex-col">
          <CardHeader className="border-b border-border/50 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  Action Required
                  {lowStockProducts.length > 0 && (
                    <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md font-bold px-1.5 py-0">
                      {lowStockProducts.length}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="mt-1">
                  Items below safety threshold
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : lowStockProducts.length === 0 ? (
              <EmptyState
                icon={PackageX}
                title="Inventory optimal"
                description="No products are currently running low."
              />
            ) : (
              <div className="divide-y divide-border">
                {lowStockProducts.slice(0, 6).map((product, index) => {
                  const stock = Number(product.stockCount) || 0;
                  const outOfStock = stock === 0;
                  return (
                    <div
                      key={product._id || index}
                      className="flex items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${outOfStock ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-amber-500/30 bg-amber-500/10 text-amber-500"}`}
                        >
                          {outOfStock ? (
                            <XCircle className="h-5 w-5" />
                          ) : (
                            <PackageX className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-foreground">
                            {product.name || "Unnamed"}
                          </p>
                          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                            {outOfStock ? "Depleted" : "Restock recommended"}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 rounded-md font-bold ${outOfStock ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-500"}`}
                      >
                        {stock} left
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
