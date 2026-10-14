import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign,
  Loader2,
  UserCheck,
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_ORDERS = "http://localhost:5000/api/orders";

// Helper to get headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("flowbox_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export default function Customers() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const res = await fetch(API_ORDERS, {
          headers: getAuthHeaders(),
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerOrders();
  }, [navigate]);

  // Aggregate unique customers and their lifetime metrics from the user's orders
  const customers = useMemo(() => {
    const customerMap = new Map();

    orders.forEach((order) => {
      const key = (order.customerEmail || order.customerName || "unknown")
        .trim()
        .toLowerCase();

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: order._id,
          name: order.customerName || "Unknown Customer",
          email: order.customerEmail || "—",
          phone: order.customerPhone || "—",
          orderCount: 0,
          totalUnits: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt || null,
        });
      }

      const entry = customerMap.get(key);
      entry.orderCount += 1;
      entry.totalUnits += Number(order.quantity) || 0;
      entry.totalSpent += Number(order.totalPrice) || 0;

      if (
        order.createdAt &&
        (!entry.lastOrderDate ||
          new Date(order.createdAt) > new Date(entry.lastOrderDate))
      ) {
        entry.lastOrderDate = order.createdAt;
      }
    });

    return Array.from(customerMap.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent,
    );
  }, [orders]);

  // Filter customers by search query
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalCustomerRevenue = customers.reduce(
    (sum, c) => sum + c.totalSpent,
    0,
  );

  return (
    <div className="space-y-6">
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Customers
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Customer directory and lifetime purchasing metrics derived from your
          order history.
        </p>
      </div>

      {/* ───────────────── SUMMARY CARDS ───────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Customers
            </CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {customers.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders Placed
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {orders.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lifetime Customer Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              $
              {totalCustomerRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ───────────────── CUSTOMER DIRECTORY TABLE ───────────────── */}
      <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b border-border bg-muted/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Customer Directory</CardTitle>
            <CardDescription>
              Ranked by total lifetime spend in your workspace.
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background pl-9"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="border-b border-border bg-muted/70 dark:bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-foreground">
                  Customer Name
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Contact Info
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Total Orders
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Units Purchased
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Lifetime Spend
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      Loading customers...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No matching customers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    {/* Customer Name */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold uppercase text-primary">
                          {customer.name.slice(0, 2)}
                        </div>
                        <span className="font-medium text-foreground">
                          {customer.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Contact Info */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </span>
                        {customer.phone !== "—" && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Order Count */}
                    <TableCell>
                      <Badge variant="secondary">
                        {customer.orderCount}{" "}
                        {customer.orderCount === 1 ? "order" : "orders"}
                      </Badge>
                    </TableCell>

                    {/* Total Units */}
                    <TableCell className="text-muted-foreground">
                      {customer.totalUnits} units
                    </TableCell>

                    {/* Lifetime Spend */}
                    <TableCell className="text-right font-semibold text-foreground">
                      $
                      {customer.totalSpent.toLocaleString(undefined, {
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
    </div>
  );
}
