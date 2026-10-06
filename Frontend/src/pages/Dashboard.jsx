import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  AlertCircle,
  Activity,
  Banknote, // 1. Added Banknote icon for the new card
} from "lucide-react";

// Recharts
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
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

// --- Chart Configurations & Mock Data ---
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
  Pending: { label: "Pending", color: "#f59e0b" },
  Shipped: { label: "Shipped", color: "#3b82f6" },
  Delivered: { label: "Delivered", color: "#10b981" },
};

export default function Dashboard() {
  // 2. Added inventoryValue to the stats state
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

        // Calculate Revenue
        const totalRevenue = orders.reduce(
          (sum, order) => sum + (order.totalPrice || 0),
          0,
        );

        // 3. Calculate Total Inventory Value (Price * Stock Count for every item)
        const totalInventoryValue = products.reduce(
          (sum, p) => sum + (p.price || 0) * (p.stockCount || 0),
          0,
        );

        setStats({
          revenue: totalRevenue,
          orders: orders.length,
          products: products.length,
          suppliers: suppliers.length,
          inventoryValue: totalInventoryValue, // Set the new metric
        });

        setRecentOrders(orders.slice(-5).reverse());

        setLowStock(
          products
            .filter((p) => p.stockCount < 15)
            .sort((a, b) => a.stockCount - b.stockCount)
            .slice(0, 5),
        );

        const statusCounts = orders.reduce(
          (acc, order) => {
            const status = order.status || "Pending";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          },
          { Pending: 0, Shipped: 0, Delivered: 0 },
        );

        setOrderStatusData(
          [
            { name: "Pending", value: statusCounts.Pending, fill: "#f59e0b" },
            { name: "Shipped", value: statusCounts.Shipped, fill: "#3b82f6" },
            {
              name: "Delivered",
              value: statusCounts.Delivered,
              fill: "#10b981",
            },
          ].filter((data) => data.value > 0),
        );
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
          <Activity className="h-7 w-7" /> Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Overview of your inventory, sales, and supply chain.
        </p>
      </div>

      {/* METRICS GRID: Updated to xl:grid-cols-5 to fit the 5th card beautifully */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              $
              {stats.revenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-slate-500 mt-1">Across all orders</p>
          </CardContent>
        </Card>

        {/* 4. THE NEW INVENTORY VALUE CARD */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Inventory Value
            </CardTitle>
            <Banknote className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              $
              {stats.inventoryValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-slate-500 mt-1">Total locked capital</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              +{stats.orders}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Processed transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Active Products
            </CardTitle>
            <Package className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.products}
            </div>
            <p className="text-xs text-slate-500 mt-1">Items in catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Suppliers
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.suppliers}
            </div>
            <p className="text-xs text-slate-500 mt-1">Partner network</p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={barChartConfig}
              className="min-h-[250px] w-full max-h-[300px]"
            >
              <BarChart accessibilityLayer data={barChartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Order Status</CardTitle>
            <CardDescription>Current fulfillment breakdown.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-0">
            <ChartContainer
              config={pieChartConfig}
              className="min-h-[250px] w-full max-h-[300px]"
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
                  strokeWidth={2}
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

      {/* BOTTOM SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
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
                      className="h-24 text-center text-slate-500"
                    >
                      No recent orders.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        {order.customerName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            order.status === "Pending"
                              ? "text-amber-600 border-amber-200 bg-amber-50"
                              : order.status === "Shipped"
                                ? "text-blue-600 border-blue-200 bg-blue-50"
                                : "text-emerald-600 border-emerald-200 bg-emerald-50"
                          }
                        >
                          {order.status || "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" /> Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStock.length === 0 ? (
                <p className="text-sm text-slate-500">
                  All inventory levels are healthy.
                </p>
              ) : (
                lowStock.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-3 last:pb-0"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        $
                        {(item.price || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <Badge variant="destructive" className="font-bold">
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
