import React, { useState, useEffect } from "react";
import { Building2, MapPin, Plus, Trash2, Box } from "lucide-react";

// Shadcn Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Warehouses() {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  const fetchStores = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/stores");
      if (response.ok) setStores(await response.json());
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          capacity: Number(formData.capacity),
        }),
      });

      if (response.ok) {
        setFormData({ name: "", location: "", capacity: "" });
        await fetchStores();
      } else {
        const errorData = await response.json();
        alert(`Failed to create warehouse: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating warehouse:", error);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure? Ensure no products are currently assigned to this warehouse!",
      )
    )
      return;
    try {
      const response = await fetch(`http://localhost:5000/api/stores/${id}`, {
        method: "DELETE",
      });
      if (response.ok) await fetchStores();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
          <Building2 className="h-7 w-7" /> Warehouses
        </h1>
        <p className="text-sm text-slate-500">
          Manage storage locations and capacity limits.
        </p>
      </div>

      {/* ADD WAREHOUSE CARD */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Add Warehouse</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAddStore}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Warehouse Name</label>
              <Input
                required
                placeholder="Main Facility"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                required
                placeholder="123 Industrial Pkwy, City"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Max Capacity (Units)
              </label>
              <div className="flex gap-2">
                <Input
                  required
                  type="number"
                  min="1"
                  placeholder="5000"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                />
                <Button
                  type="submit"
                  size="icon"
                  className="shrink-0 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* WAREHOUSE TABLE CARD */}
      <Card className="overflow-hidden p-2">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[250px]">Facility Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Current Load</TableHead>
              <TableHead>Max Capacity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-slate-500"
                >
                  Loading warehouses...
                </TableCell>
              </TableRow>
            ) : stores.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-slate-500"
                >
                  No warehouses found.
                </TableCell>
              </TableRow>
            ) : (
              stores.map((store) => {
                // Calculate capacity percentage to warn if getting full
                const loadPercentage =
                  store.capacity > 0
                    ? (store.currentLoad / store.capacity) * 100
                    : 0;
                const isNearingCapacity = loadPercentage >= 85;

                return (
                  <TableRow key={store._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />{" "}
                        {store.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />{" "}
                        {store.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`font-medium ${isNearingCapacity ? "bg-amber-100 text-amber-800" : ""}`}
                      >
                        <Box className="h-3 w-3 mr-1" />
                        {store.currentLoad} units
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      {store.capacity} units
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(store._id)}
                        className="text-slate-400 hover:text-destructive"
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
      </Card>
    </div>
  );
}
