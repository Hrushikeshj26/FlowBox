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
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  UserMinus,
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
import { Button } from "@/components/ui/button";
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

const formatCurrency = (value) =>
  `$${(Number(value) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function Customers() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Aggregate unique customers and their lifetime metrics
  const customers = useMemo(() => {
    const customerMap = new Map();

    orders.forEach((order) => {
      const key = (order.customerEmail || order.customerName || "unknown")
        .trim()
        .toLowerCase();

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: order._id, // using first order ID as unique key fallback
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

  // Filter & Pagination Logic
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query),
    );
  }, [customers, searchQuery]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Global Metrics
  const totalCustomerRevenue = customers.reduce(
    (sum, c) => sum + c.totalSpent,
    0,
  );
  const averageOrderValue =
    orders.length > 0 ? totalCustomerRevenue / orders.length : 0;

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-12 pt-2">
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/65 pb-6 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Users className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Customer CRM
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            View lifetime purchasing metrics and contact records derived from
            your order history.
          </p>
        </div>
      </div>

      {/* ───────────────── SUMMARY KPI CARDS ───────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="group overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Unique Customers
              </p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <UserCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  customers.length.toLocaleString()
                )}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                Total recorded buyers
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Orders Processed
              </p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 transition-transform group-hover:scale-110">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  orders.length.toLocaleString()
                )}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                Across all customers
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Lifetime Value (LTV)
              </p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-transform group-hover:scale-110">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  formatCurrency(totalCustomerRevenue)
                )}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                Total global revenue
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Order Value
              </p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 transition-transform group-hover:scale-110">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  formatCurrency(averageOrderValue)
                )}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                Per transaction average
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ───────────────── CUSTOMER DIRECTORY TABLE ───────────────── */}
      <div className="space-y-4">
        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              className="pl-9 h-10 w-full bg-card shadow-sm border-border/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE CARD */}
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm transition-all hover:shadow-md">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40 border-b border-border/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-12 pl-6 text-xs font-bold uppercase tracking-wider">
                    Client Identity
                  </TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">
                    Contact Records
                  </TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">
                    Activity
                  </TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">
                    Volume
                  </TableHead>
                  <TableHead className="h-12 pr-6 text-right text-xs font-bold uppercase tracking-wider">
                    Lifetime Spend
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-sm font-medium">
                          Aggregating customer records...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <UserMinus className="h-10 w-10 mb-4 opacity-50" />
                        <p className="text-sm font-medium text-foreground">
                          No customer records found
                        </p>
                        <p className="text-xs mt-1">
                          Adjust your search or wait for new orders.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      {/* Identity */}
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-primary/5 text-sm font-bold text-primary">
                            {customer.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm text-foreground">
                            {customer.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Contact Info */}
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-primary/70" />
                            {customer.email}
                          </span>
                          {customer.phone !== "—" && (
                            <span className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-primary/70" />
                              {customer.phone}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Order Count */}
                      <TableCell className="py-4">
                        <Badge
                          variant="secondary"
                          className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider"
                        >
                          {customer.orderCount}{" "}
                          {customer.orderCount === 1 ? "Order" : "Orders"}
                        </Badge>
                      </TableCell>

                      {/* Total Units */}
                      <TableCell className="py-4 text-sm font-medium text-muted-foreground">
                        {customer.totalUnits} units
                      </TableCell>

                      {/* Lifetime Spend */}
                      <TableCell className="py-4 pr-6 text-right">
                        <span className="font-bold text-sm tabular-nums text-foreground">
                          {formatCurrency(customer.totalSpent)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION FOOTER */}
          {!isLoading && filteredCustomers.length > 0 && (
            <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-6 py-4">
              <div className="text-xs font-medium text-muted-foreground">
                Showing{" "}
                <span className="font-bold text-foreground">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-foreground">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredCustomers.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-bold text-foreground">
                  {filteredCustomers.length}
                </span>{" "}
                customers
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
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
