import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Plus, Trash2, Box, Loader2 } from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_WAREHOUSES = "http://localhost:5000/api/warehouses";

// Helper to get headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("flowbox_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export default function Warehouses() {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  // 1. Fetch only the logged-in user's warehouses
  const fetchWarehouses = async () => {
    try {
      const res = await fetch(API_WAREHOUSES, {
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        // Token expired or not logged in
        navigate("/login");
        return;
      }
      const data = await res.json();
      setWarehouses(data);
    } catch (error) {
      console.error("Failed to fetch warehouses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // 2. Create a warehouse for the logged-in user
  const handleCreateWarehouse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_WAREHOUSES, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: newWarehouse.name,
          location: newWarehouse.location,
          capacity: Number(newWarehouse.capacity),
          currentLoad: 0,
        }),
      });

      const created = await res.json();
      if (!res.ok) throw new Error(created.message);

      // Prepend new warehouse to state
      setWarehouses((prev) => [created, ...prev]);

      // Reset form
      setNewWarehouse({
        name: "",
        location: "",
        capacity: "",
      });
    } catch (error) {
      console.error("Error creating warehouse:", error.message);
      alert(`Failed to create warehouse: ${error.message}`);
    }
  };

  // 3. Delete a warehouse
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure? Ensure no products are currently assigned to this warehouse!",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`${API_WAREHOUSES}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.ok) {
        setWarehouses((prev) => prev.filter((w) => w._id !== id));
      }
    } catch (error) {
      console.error("Error deleting warehouse:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* ───────────────── HEADER ───────────────── */}

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Warehouses
          </h1>
        </div>

        <p className="text-sm text-muted-foreground">
          Manage storage locations and capacity limits.
        </p>
      </div>

      {/* ───────────────── ADD WAREHOUSE ───────────────── */}

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Add Warehouse</CardTitle>

          <CardDescription>
            Create a storage facility and define its maximum capacity.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleCreateWarehouse}
            className="grid grid-cols-1 items-end gap-4 md:grid-cols-4"
          >
            {/* Warehouse Name */}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Warehouse Name
              </label>

              <Input
                required
                placeholder="Main Facility"
                value={newWarehouse.name}
                onChange={(e) =>
                  setNewWarehouse({
                    ...newWarehouse,
                    name: e.target.value,
                  })
                }
                className="bg-background"
              />
            </div>

            {/* Location */}

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground">
                Location
              </label>

              <Input
                required
                placeholder="123 Industrial Pkwy, City"
                value={newWarehouse.location}
                onChange={(e) =>
                  setNewWarehouse({
                    ...newWarehouse,
                    location: e.target.value,
                  })
                }
                className="bg-background"
              />
            </div>

            {/* Capacity */}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Max Capacity (Units)
              </label>

              <div className="flex gap-2">
                <Input
                  required
                  type="number"
                  min="1"
                  placeholder="5000"
                  value={newWarehouse.capacity}
                  onChange={(e) =>
                    setNewWarehouse({
                      ...newWarehouse,
                      capacity: e.target.value,
                    })
                  }
                  className="bg-background"
                />

                <Button
                  type="submit"
                  size="icon"
                  className="shrink-0"
                  aria-label="Add warehouse"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ───────────────── WAREHOUSE TABLE ───────────────── */}

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <div>
            <CardTitle className="text-lg">Warehouse Directory</CardTitle>

            <CardDescription className="mt-1">
              Monitor warehouse locations, stock load, and capacity.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            {/* Distinct table header */}

            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="h-11 w-[250px] font-semibold text-foreground">
                  Facility Name
                </TableHead>

                <TableHead className="h-11 font-semibold text-foreground">
                  Location
                </TableHead>

                <TableHead className="h-11 font-semibold text-foreground">
                  Current Load
                </TableHead>

                <TableHead className="h-11 font-semibold text-foreground">
                  Max Capacity
                </TableHead>

                <TableHead className="h-11 text-right font-semibold text-foreground">
                  Actions
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
                      Loading warehouses...
                    </div>
                  </TableCell>
                </TableRow>
              ) : warehouses.length === 0 ? (
                /* Empty */

                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No warehouses found.
                  </TableCell>
                </TableRow>
              ) : (
                warehouses.map((store) => {
                  const loadPercentage =
                    store.capacity > 0
                      ? (store.currentLoad / store.capacity) * 100
                      : 0;

                  const isNearingCapacity = loadPercentage >= 85;

                  const isFull = loadPercentage >= 100;

                  return (
                    <TableRow
                      key={store._id}
                      className="transition-colors hover:bg-muted/40"
                    >
                      {/* Facility */}

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Building2 className="h-4 w-4" />
                          </div>

                          <span className="font-medium text-foreground">
                            {store.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Location */}

                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-muted-foreground/70" />

                          <span>{store.location}</span>
                        </div>
                      </TableCell>

                      {/* Current Load */}

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            isFull
                              ? "border-destructive/30 bg-destructive/10 text-destructive"
                              : isNearingCapacity
                                ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "border-primary/20 bg-primary/10 text-primary"
                          }
                        >
                          <Box className="mr-1 h-3 w-3" />
                          {store.currentLoad} units
                        </Badge>
                      </TableCell>

                      {/* Capacity */}

                      <TableCell>
                        <span className="font-medium text-muted-foreground">
                          {store.capacity} units
                        </span>
                      </TableCell>

                      {/* Actions */}

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(store._id)}
                          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Delete ${store.name}`}
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
        </CardContent>
      </Card>
    </div>
  );
}
