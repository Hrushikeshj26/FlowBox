import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  Plus,
  Trash2,
  Mail,
  Phone,
  Tag,
  Loader2,
  Building,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_SUPPLIERS = "http://localhost:5000/api/suppliers";

// Helper to get headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("flowbox_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export default function Suppliers() {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    category: "",
    phone: "",
  });

  // 1. Fetch only the logged-in user's suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(API_SUPPLIERS, {
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // 2. Create a supplier for the logged-in user
  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(API_SUPPLIERS, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create supplier");
      }

      // Reset form
      setFormData({
        name: "",
        contact: "",
        category: "",
        phone: "",
      });

      // Prepend newly created supplier (supports both { data: newSupplier } and direct object)
      const createdSupplier = result.data || result;
      setSuppliers((prev) => [createdSupplier, ...prev]);
    } catch (error) {
      console.error("Error creating supplier:", error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Delete a supplier
  const handleDeleteSupplier = async (id) => {
    if (!window.confirm("Are you sure you want to remove this supplier?")) {
      return;
    }

    try {
      const res = await fetch(`${API_SUPPLIERS}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.ok) {
        setSuppliers((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Truck className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Suppliers
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage vendor partnerships, contact directories, and supply
          categories.
        </p>
      </div>

      {/* ───────────────── ADD SUPPLIER CARD ───────────────── */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 pb-4">
          <CardTitle className="text-lg">Add Supplier</CardTitle>
          <CardDescription>
            Register a new vendor to your supply chain directory.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            onSubmit={handleCreateSupplier}
            className="grid grid-cols-1 items-end gap-4 md:grid-cols-4"
          >
            {/* Supplier Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Company Name
              </label>
              <Input
                required
                placeholder="Apex Global Supply"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Contact Email
              </label>
              <Input
                required
                type="email"
                placeholder="orders@apexsupply.com"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Category
              </label>
              <Input
                required
                placeholder="Electronics, Packaging..."
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>

            {/* Phone + Submit */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Phone Number
              </label>
              <div className="flex gap-2">
                <Input
                  required
                  placeholder="+1 (555) 234-5678"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isSubmitting}
                  className="shrink-0"
                  aria-label="Add supplier"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ───────────────── SUPPLIERS TABLE ───────────────── */}
      <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
        <Table>
          <TableHeader className="border-b border-border bg-muted/70 dark:bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[260px] font-semibold text-foreground">
                Supplier Name
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Contact Email
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Category
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Phone
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Actions
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
                    Loading suppliers...
                  </div>
                </TableCell>
              </TableRow>
            ) : suppliers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No suppliers found.
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow
                  key={supplier._id}
                  className="transition-colors hover:bg-muted/40"
                >
                  {/* Supplier Name */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Building className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-foreground">
                        {supplier.name}
                      </span>
                    </div>
                  </TableCell>

                  {/* Contact Email */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 text-muted-foreground/70" />
                      <span>{supplier.contact}</span>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="border border-border bg-secondary text-secondary-foreground"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {supplier.category}
                    </Badge>
                  </TableCell>

                  {/* Phone */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 text-muted-foreground/70" />
                      <span>{supplier.phone}</span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSupplier(supplier._id)}
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Delete ${supplier.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
