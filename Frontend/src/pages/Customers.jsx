import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  ShoppingBag,
  ArrowUpRight,
  Award,
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

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    total: 0,
    repeat: 0,
    avgSpent: 0,
  });

  useEffect(() => {
    const fetchAndAggregateCustomers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders");
        const orders = response.ok ? await response.json() : [];

        // Aggregate order data into customer profiles
        const customerMap = {};

        orders.forEach((order) => {
          const name = order.customerName || "Unknown Customer";

          if (!customerMap[name]) {
            customerMap[name] = {
              id: name,
              name,
              email: order.customerEmail || "",
              phone: order.customerPhone || "",
              totalOrders: 0,
              totalSpent: 0,
            };
          }

          customerMap[name].totalOrders += 1;
          customerMap[name].totalSpent += order.totalPrice || 0;

          // Keep the latest available contact information
          if (order.customerEmail) {
            customerMap[name].email = order.customerEmail;
          }

          if (order.customerPhone) {
            customerMap[name].phone = order.customerPhone;
          }
        });

        const customerArray = Object.values(customerMap).sort(
          (a, b) => b.totalSpent - a.totalSpent,
        );

        // CRM metrics
        const repeatCustomers = customerArray.filter(
          (customer) => customer.totalOrders > 1,
        ).length;

        const totalRevenue = customerArray.reduce(
          (sum, customer) => sum + customer.totalSpent,
          0,
        );

        setMetrics({
          total: customerArray.length,
          repeat: repeatCustomers,
          avgSpent:
            customerArray.length > 0 ? totalRevenue / customerArray.length : 0,
        });

        setCustomers(customerArray);
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndAggregateCustomers();
  }, []);

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();

    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(searchQuery)
    );
  });

  return (
    <div className="space-y-6">
      {/* ───────────────── HEADER ───────────────── */}

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Customer Directory
          </h1>
        </div>

        <p className="text-sm text-muted-foreground">
          View client history, lifetime value, and order frequencies.
        </p>
      </div>

      {/* ─────────────── CRM METRICS ─────────────── */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Total Clients */}

        <Card className="transition-colors hover:border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clients
            </CardTitle>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {metrics.total}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Unique buyers recorded
            </p>
          </CardContent>
        </Card>

        {/* Repeat Customers */}

        <Card className="transition-colors hover:border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Repeat Customers
            </CardTitle>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500/10">
              <Award className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {metrics.repeat}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Clients with 2+ orders
            </p>
          </CardContent>
        </Card>

        {/* Average Lifetime Value */}

        <Card className="transition-colors hover:border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Lifetime Value
            </CardTitle>

            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10">
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              $
              {metrics.avgSpent.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Revenue per customer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ─────────────── CUSTOMER DIRECTORY ─────────────── */}

      <Card className="overflow-hidden">
        {/* Header */}

        <CardHeader className="border-b border-border bg-muted/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                Client Database
              </CardTitle>

              <CardDescription>
                Automatically generated from order history.
              </CardDescription>
            </div>

            {/* Search */}

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="h-9 bg-background pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        {/* Table */}

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead>Customer</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Lifetime Spent</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Loading */}

              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Compiling customer data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                /* Empty */

                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                /* Customers */

                filteredCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    {/* Customer */}

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>

                        <span className="font-medium text-foreground">
                          {customer.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Email */}

                    <TableCell>
                      {customer.email ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                          <span>{customer.email}</span>
                        </div>
                      ) : (
                        <span className="text-xs italic text-muted-foreground/70">
                          Not provided
                        </span>
                      )}
                    </TableCell>

                    {/* Phone */}

                    <TableCell>
                      {customer.phone ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                          <span>{customer.phone}</span>
                        </div>
                      ) : (
                        <span className="text-xs italic text-muted-foreground/70">
                          Not provided
                        </span>
                      )}
                    </TableCell>

                    {/* Orders */}

                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground/70" />

                        <span className="font-medium text-foreground">
                          {customer.totalOrders}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}

                    <TableCell>
                      {customer.totalOrders > 2 ? (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        >
                          VIP Client
                        </Badge>
                      ) : customer.totalOrders > 1 ? (
                        <Badge
                          variant="outline"
                          className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        >
                          Returning
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-border bg-muted/50 text-muted-foreground"
                        >
                          New
                        </Badge>
                      )}
                    </TableCell>

                    {/* Lifetime Spent */}

                    <TableCell className="text-right">
                      <span className="font-bold text-foreground">
                        $
                        {customer.totalSpent.toLocaleString(undefined, {
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
