import React, { useEffect, useState } from "react";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  AlertCircle,
  Activity,
  Banknote,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// ─────────────────────────────────────────────
// Chart configuration
// ─────────────────────────────────────────────

const barChartConfig = {
  revenue: {
    label: "Revenue ($)",
    color: "var(--color-primary)",
  },
};

const barChartData = [
  { month: "May", revenue: 1850 },
  { month: "Jun", revenue: 2400 },
  { month: "Jul", revenue: 2100 },
  { month: "Aug", revenue: 3100 },
  { month: "Sep", revenue: 2800 },
  { month: "Oct", revenue: 3800 },
];

const pieChartConfig = {
  Pending: {
    label: "Pending",
    color: "#f59e0b",
  },
  Shipped: {
    label: "Shipped",
    color: "#3b82f6",
  },
  Delivered: {
    label: "Delivered",
    color: "#10b981",
  },
};

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    suppliers: 0,
    inventoryValue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, productsRes, suppliersRes] = await Promise.all([
          fetch("http://localhost:5000/api/orders"),
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/suppliers"),
        ]);

        const orders = ordersRes.ok ? await ordersRes.json() : [];
        const products = productsRes.ok ? await productsRes.json() : [];
        const suppliers = suppliersRes.ok ? await suppliersRes.json() : [];

        // Total revenue
        const totalRevenue = orders.reduce(
          (sum, order) => sum + (order.totalPrice || 0),
          0,
        );

        // Total inventory value
        const totalInventoryValue = products.reduce(
          (sum, product) =>
            sum + (product.price || 0) * (product.stockCount || 0),
          0,
        );

        setStats({
          revenue: totalRevenue,
          orders: orders.length,
          products: products.length,
          suppliers: suppliers.length,
          inventoryValue: totalInventoryValue,
        });

        // Recent orders
        setRecentOrders(orders.slice(-5).reverse());

        // Low stock
        setLowStock(
          products
            .filter((product) => product.stockCount < 15)
            .sort((a, b) => a.stockCount - b.stockCount)
            .slice(0, 5),
        );

        // Order status
        const statusCounts = orders.reduce(
          (acc, order) => {
            const status = order.status || "Pending";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          },
          {
            Pending: 0,
            Shipped: 0,
            Delivered: 0,
          },
        );

        setOrderStatusData(
          [
            {
              name: "Pending",
              value: statusCounts.Pending,
              fill: "#f59e0b",
            },
            {
              name: "Shipped",
              value: statusCounts.Shipped,
              fill: "#3b82f6",
            },
            {
              name: "Delivered",
              value: statusCounts.Delivered,
              fill: "#10b981",
            },
          ].filter((item) => item.value > 0),
        );
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ─────────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ───────────────── HEADER ───────────────── */}

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Activity className="h-5 w-5" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
        </div>

        <p className="text-sm text-muted-foreground">
          Overview of your inventory, sales, and supply chain.
        </p>
      </div>

      {/* ──────────────── METRICS ──────────────── */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Revenue */}

        <Card className="transition-colors hover:border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              $
              {stats.revenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Across all orders
            </p>
          </CardContent>
        </Card>

        {/* Inventory Value */}

        <Card className="transition-colors hover:border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inventory Value
            </CardTitle>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10">
              <Banknote className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              $
              {stats.inventoryValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Total locked capital
            </p>
          </CardContent>
        </Card>

        {/* Orders */}

        <Card className="transition-colors hover:border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/10">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              +{stats.orders}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Processed transactions
            </p>
          </CardContent>
        </Card>

        {/* Products */}

        <Card className="transition-colors hover:border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Products
            </CardTitle>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-500/10">
              <Package className="h-4 w-4 text-violet-500" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stats.products}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Items in catalog
            </p>
          </CardContent>
        </Card>

        {/* Suppliers */}

        <Card className="transition-colors hover:border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Suppliers
            </CardTitle>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/10">
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stats.suppliers}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Partner network
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ──────────────── CHARTS ──────────────── */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">
              Revenue Overview
            </CardTitle>

            <CardDescription>Monthly revenue performance.</CardDescription>
          </CardHeader>

          <CardContent>
            <ChartContainer
              config={barChartConfig}
              className="min-h-[250px] max-h-[300px] w-full"
            >
              <BarChart accessibilityLayer data={barChartData}>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)" }}
                />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />

                <Bar
                  dataKey="revenue"
                  fill="var(--color-primary)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Status */}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">
              Order Status
            </CardTitle>

            <CardDescription>Current fulfillment breakdown.</CardDescription>
          </CardHeader>

          <CardContent className="flex justify-center pb-0">
            <ChartContainer
              config={pieChartConfig}
              className="min-h-[250px] max-h-[300px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />

                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  stroke="var(--card)"
                  strokeWidth={3}
                  paddingAngle={2}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ──────────────── BOTTOM ──────────────── */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders */}

        <Card className="overflow-hidden p-3 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">
              Recent Orders
            </CardTitle>

            <CardDescription>
              Your latest customer transactions.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No recent orders.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium text-foreground">
                        {order.customerName}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            order.status === "Pending"
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : order.status === "Shipped"
                                ? "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          }
                        >
                          {order.status || "Pending"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right font-medium text-foreground">
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

        {/* Low Stock */}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertCircle className="h-5 w-5" />
              Low Stock Alerts
            </CardTitle>

            <CardDescription>Products that need attention.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {lowStock.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  All inventory levels are healthy.
                </p>
              ) : (
                lowStock.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-foreground">
                        {item.name}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        $
                        {(item.price || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <Badge
                      variant="destructive"
                      className="ml-3 shrink-0 font-bold"
                    >
                      {item.stockCount} left
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
