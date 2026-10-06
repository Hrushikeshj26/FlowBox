import React, { useState, useEffect } from "react";
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
      if (response.ok) setSuppliers(await response.json());
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", contact: "", phone: "", category: "" });
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
    if (!window.confirm("Are you sure you want to delete this supplier?"))
      return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/suppliers/${id}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) setSuppliers(suppliers.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
          <Truck className="h-7 w-7" /> Suppliers
        </h1>
        <p className="text-sm text-slate-500">
          Manage supply chain contacts and procurement.
        </p>
      </div>

      {/* ADD SUPPLIER CARD */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Add Supplier</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAddSupplier}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <Input
                required
                placeholder="Acme Corp"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                required
                type="email"
                placeholder="email@company.com"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                required
                placeholder="(555) 000-0000"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Category</label>
              <div className="flex gap-2">
                <Input
                  required
                  placeholder="Electronics"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
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

      {/* SUPPLIERS TABLE CARD */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[250px]">Company</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
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
                  Loading suppliers...
                </TableCell>
              </TableRow>
            ) : suppliers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-slate-500"
                >
                  No suppliers found.
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-slate-400" />{" "}
                      {supplier.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {supplier.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />{" "}
                      {supplier.contact}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />{" "}
                      {supplier.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(supplier._id)}
                      className="text-slate-400 hover:text-slate-900"
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
