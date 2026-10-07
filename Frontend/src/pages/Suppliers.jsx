import React, { useEffect, useState } from "react";
import { Truck, Mail, Phone, Building, Plus, Trash2 } from "lucide-react";

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

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    phone: "",
    category: "",
  });

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/suppliers");

      if (response.ok) {
        setSuppliers(await response.json());
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

  const handleAddSupplier = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          name: "",
          contact: "",
          phone: "",
          category: "",
        });

        await fetchSuppliers();
      } else {
        const errorData = await response.json();

        alert(`Failed to add supplier: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating supplier:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/suppliers/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setSuppliers((currentSuppliers) =>
          currentSuppliers.filter((supplier) => supplier._id !== id),
        );
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
          Manage supply chain contacts and procurement.
        </p>
      </div>

      {/* ───────────────── ADD SUPPLIER ───────────────── */}

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Add Supplier</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleAddSupplier}
            className="grid grid-cols-1 items-end gap-4 md:grid-cols-5"
          >
            {/* Company */}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Company
              </label>

              <Input
                required
                placeholder="Acme Corp"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="bg-background"
              />
            </div>

            {/* Email */}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>

              <Input
                required
                type="email"
                placeholder="email@company.com"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: e.target.value,
                  })
                }
                className="bg-background"
              />
            </div>

            {/* Phone */}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Phone
              </label>

              <Input
                required
                placeholder="(555) 000-0000"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                className="bg-background"
              />
            </div>

            {/* Category + Add */}

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground">
                Category
              </label>

              <div className="flex gap-2">
                <Input
                  required
                  placeholder="Electronics"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                  className="bg-background"
                />

                <Button
                  type="submit"
                  size="icon"
                  className="shrink-0"
                  aria-label="Add supplier"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ───────────────── SUPPLIERS TABLE ───────────────── */}

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <div>
            <CardTitle className="text-lg">Supplier Directory</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your registered suppliers and their contact details.
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            {/* Distinct table header */}

            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="h-11 w-[250px] font-semibold text-foreground">
                  Company
                </TableHead>

                <TableHead className="h-11 font-semibold text-foreground">
                  Category
                </TableHead>

                <TableHead className="h-11 font-semibold text-foreground">
                  Email
                </TableHead>

                <TableHead className="h-11 font-semibold text-foreground">
                  Phone
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
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Loading suppliers...
                    </div>
                  </TableCell>
                </TableRow>
              ) : suppliers.length === 0 ? (
                /* Empty */

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
                    {/* Company */}

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

                    {/* Category */}

                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-primary/20 bg-primary/10 font-medium text-primary"
                      >
                        {supplier.category}
                      </Badge>
                    </TableCell>

                    {/* Email */}

                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 text-muted-foreground/70" />

                        <span>{supplier.contact}</span>
                      </div>
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
                        onClick={() => handleDelete(supplier._id)}
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
        </CardContent>
      </Card>
    </div>
  );
}
