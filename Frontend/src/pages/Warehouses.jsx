import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Plus,
  Trash2,
  Box,
  Loader2,
  Search,
  Filter,
  BarChart3,
  AlertTriangle,
  PackageCheck,
  Building,
  FileX2,
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

const API_WAREHOUSES = "http://localhost:5000/api/warehouses";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  const fetchWarehouses = async () => {
    try {
      const res = await fetch(API_WAREHOUSES, {
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
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

  const handleCreateWarehouse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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

      setWarehouses((prev) => [created, ...prev]);
      setNewWarehouse({ name: "", location: "", capacity: "" });
    } catch (error) {
      console.error("Error creating warehouse:", error.message);
      alert(`Failed to create warehouse: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, currentLoad) => {
    if (currentLoad > 0) {
      alert(
        "Cannot delete a warehouse that currently holds inventory. Please transfer all stock first.",
      );
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to permanently delete this facility?",
      )
    )
      return;

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

  // --- Filtering & Metrics Logic ---
  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((w) => {
      const matchesSearch =
        w.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const loadPercentage =
        w.capacity > 0 ? (w.currentLoad / w.capacity) * 100 : 0;

      let matchesStatus = true;
      if (statusFilter === "Nearing Capacity")
        matchesStatus = loadPercentage >= 80 && loadPercentage < 100;
      if (statusFilter === "Full") matchesStatus = loadPercentage >= 100;

      return matchesSearch && matchesStatus;
    });
  }, [warehouses, searchQuery, statusFilter]);

  const globalMetrics = useMemo(() => {
    const totalCapacity = warehouses.reduce(
      (sum, w) => sum + (w.capacity || 0),
      0,
    );
    const totalLoad = warehouses.reduce(
      (sum, w) => sum + (w.currentLoad || 0),
      0,
    );
    const globalUtilization =
      totalCapacity > 0 ? ((totalLoad / totalCapacity) * 100).toFixed(1) : 0;
    const criticalNodes = warehouses.filter(
      (w) => w.capacity > 0 && w.currentLoad / w.capacity >= 0.85,
    ).length;

    return { totalCapacity, totalLoad, globalUtilization, criticalNodes };
  }, [warehouses]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-12 pt-2">
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/65 pb-6 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Building2 className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Facility Management
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your physical storage locations and monitor live capacity
            utilization.
          </p>
        </div>
      </div>

      {/* ───────────────── TELEMETRY CARDS ───────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="group overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total Facilities
              </p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Building className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  warehouses.length
                )}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                Active warehouse nodes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Global Capacity Limit
              </p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 transition-transform group-hover:scale-110">
                <PackageCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  globalMetrics.totalCapacity.toLocaleString()
                )}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                Maximum units storable
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Global Utilization
              </p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 transition-transform group-hover:scale-110">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  `${globalMetrics.globalUtilization}%`
                )}
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all bg-cyan-500"
                  style={{ width: `${globalMetrics.globalUtilization}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Critical Nodes
              </p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition-transform group-hover:scale-110">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  globalMetrics.criticalNodes
                )}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                Facilities {">"} 85% full
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ───────────────── ADD WAREHOUSE FORM ───────────────── */}
      <Card className="overflow-hidden border-border/70 bg-card shadow-sm transition-all hover:shadow-md">
        <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
          <CardTitle className="text-base font-bold">
            Register New Facility
          </CardTitle>
          <CardDescription className="text-xs">
            Create a storage location and define its maximum unit capacity
            limit.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-6">
          <form
            onSubmit={handleCreateWarehouse}
            className="grid grid-cols-1 gap-5 md:grid-cols-12 items-end"
          >
            <div className="space-y-2 md:col-span-4">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Facility Name
              </label>
              <Input
                required
                placeholder="e.g. Primary Hub"
                className="h-10 bg-background/50"
                value={newWarehouse.name}
                onChange={(e) =>
                  setNewWarehouse({ ...newWarehouse, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 md:col-span-5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Physical Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  required
                  placeholder="123 Industrial Pkwy, City"
                  className="h-10 pl-9 bg-background/50"
                  value={newWarehouse.location}
                  onChange={(e) =>
                    setNewWarehouse({
                      ...newWarehouse,
                      location: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Max Capacity
              </label>
              <Input
                required
                type="number"
                min="1"
                placeholder="5000"
                className="h-10 bg-background/50"
                value={newWarehouse.capacity}
                onChange={(e) =>
                  setNewWarehouse({ ...newWarehouse, capacity: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-1 flex justify-end mt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                size="icon"
                className="h-10 w-10 shrink-0 shadow-sm"
                title="Register Facility"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ───────────────── WAREHOUSE DIRECTORY TABLE ───────────────── */}
      <div className="space-y-4">
        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by facility name or location..."
              className="pl-9 h-10 w-full bg-card shadow-sm border-border/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" /> Filter:
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-[170px] bg-card border-border/70 shadow-sm">
                <SelectValue placeholder="All Facilities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Facilities</SelectItem>
                <SelectItem value="Nearing Capacity">
                  Nearing Capacity
                </SelectItem>
                <SelectItem value="Full">At Max Capacity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* TABLE CARD */}
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm transition-all hover:shadow-md">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40 border-b border-border/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-12 pl-6 text-xs font-bold uppercase tracking-wider w-[350px]">
                    Facility Identity
                  </TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">
                    Location
                  </TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider w-[250px]">
                    Capacity Utilization
                  </TableHead>
                  <TableHead className="h-12 pr-6 text-right text-xs font-bold uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-sm font-medium">
                          Fetching facility records...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredWarehouses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FileX2 className="h-10 w-10 mb-4 opacity-50" />
                        <p className="text-sm font-medium text-foreground">
                          No facilities found
                        </p>
                        <p className="text-xs mt-1">
                          Adjust filters or register a new location.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWarehouses.map((store) => {
                    const capacity = store.capacity || 0;
                    const load = store.currentLoad || 0;
                    const utilization =
                      capacity > 0 ? (load / capacity) * 100 : 0;

                    const isFull = utilization >= 100;
                    const isNearingCapacity = utilization >= 80 && !isFull;

                    let progressColor = "bg-primary";
                    if (isFull) progressColor = "bg-destructive";
                    else if (isNearingCapacity) progressColor = "bg-amber-500";

                    return (
                      <TableRow
                        key={store._id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        {/* Facility Identity */}
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/50 text-muted-foreground">
                              <Building2 className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm text-foreground">
                                {store.name}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono mt-0.5">
                                ID: {store._id.slice(-6)}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Location */}
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0 text-primary" />
                            <span>{store.location}</span>
                          </div>
                        </TableCell>

                        {/* Visual Capacity Bar */}
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1.5 pr-8">
                            <div className="flex justify-between items-center text-xs font-semibold tabular-nums">
                              <span className="text-foreground">
                                {load.toLocaleString()} /{" "}
                                {capacity.toLocaleString()}
                              </span>
                              <span
                                className={
                                  isFull
                                    ? "text-destructive"
                                    : isNearingCapacity
                                      ? "text-amber-500"
                                      : "text-muted-foreground"
                                }
                              >
                                {utilization.toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full transition-all ${progressColor}`}
                                style={{
                                  width: `${Math.min(utilization, 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-4 pr-6 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={load > 0} // Prevent deletion if warehouse has stock
                            onClick={() => handleDelete(store._id, load)}
                            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={
                              load > 0
                                ? "Cannot delete facility with active stock"
                                : "Delete Facility"
                            }
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
        </Card>
      </div>
    </div>
  );
}
