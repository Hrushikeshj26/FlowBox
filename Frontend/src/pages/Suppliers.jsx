import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import {
  Truck,
  Plus,
  Trash2,
  Mail,
  Phone,
  Tag,
  Loader2,
  Building,
  UploadCloud,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileX2,
  Briefcase,
  Layers,
} from "lucide-react";

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

const API_SUPPLIERS = "http://localhost:5000/api/suppliers";

const getAuthHeaders = () => {
  const token = localStorage.getItem("flowbox_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export default function Suppliers() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Search, Filter & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    category: "",
    phone: "",
  });

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(API_SUPPLIERS, {
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch suppliers");

      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // --- Derived Metrics ---
  const categoriesList = useMemo(() => {
    return [
      ...new Set(suppliers.map((s) => s.category?.trim()).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));
  }, [suppliers]);

  const topCategory = useMemo(() => {
    if (suppliers.length === 0) return "N/A";
    const counts = suppliers.reduce((acc, s) => {
      const cat = s.category?.trim() || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce(
      (a, b) => (counts[a] > counts[b] ? a : b),
      "N/A",
    );
  }, [suppliers]);

  // --- Filtering & Pagination Logic ---
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const search = searchQuery.toLowerCase().trim();
      const matchesSearch = [
        supplier.name,
        supplier.contact,
        supplier.phone,
      ].some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(search),
      );
      const matchesCategory =
        selectedCategory === "all" ||
        supplier.category?.trim() === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [suppliers, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage) || 1;
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(API_SUPPLIERS, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (res.status === 401) return navigate("/login");

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to create supplier");

      const createdSupplier = result.data || result;
      setSuppliers((prev) => [createdSupplier, ...prev]);
      setFormData({ name: "", contact: "", category: "", phone: "" });
    } catch (error) {
      console.error("Error creating supplier:", error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently remove this supplier?",
      )
    )
      return;

    try {
      const res = await fetch(`${API_SUPPLIERS}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.status === 401) return navigate("/login");

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Failed to delete supplier");
      }

      setSuppliers((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert(error.message);
    }
  };

  // --- CSV Logic ---
  const downloadTemplate = () => {
    const csvContent = [
      "name,contact,category,phone",
      "Apex Supplies,orders@apex.com,Packaging,+15551234567",
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "flowbox_suppliers_template.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          if (results.errors.length > 0)
            throw new Error(
              "Some rows could not be parsed. Please check your CSV.",
            );

          const parsedSuppliers = results.data.map((row) => ({
            name: String(row.name || "").trim(),
            contact: String(row.contact || "").trim(),
            category: String(row.category || "").trim(),
            phone: String(row.phone || "").trim(),
          }));

          const validSuppliers = parsedSuppliers.filter(
            (s) => s.name && s.contact && s.category && s.phone,
          );
          if (validSuppliers.length === 0)
            throw new Error(
              "No valid suppliers found. Check your CSV headers and data.",
            );

          const response = await fetch(`${API_SUPPLIERS}/bulk`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ suppliers: validSuppliers }),
          });

          if (response.status === 401) return navigate("/login");

          const data = await response.json();
          if (!response.ok)
            throw new Error(data.message || "Failed to import suppliers");

          alert(data.message || "Suppliers imported successfully!");
          await fetchSuppliers();
        } catch (error) {
          alert(`Import failed: ${error.message}`);
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
      error: () => {
        alert("Error reading CSV file.");
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-12 pt-2">
      {/* ───────────────── HEADER & CSV ACTIONS ───────────────── */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/65 pb-6 lg:flex-row lg:items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Truck className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Supplier Network
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your vendor partnerships, contact directories, and supply
            categories.
          </p>
        </div>

        {/* CSV Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-lg border border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadTemplate}
              className="h-9 shadow-sm text-xs px-3"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Template
            </Button>

            <Button
              size="sm"
              onClick={triggerFileInput}
              disabled={isUploading}
              className="h-9 shadow-sm text-xs px-4"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
              )}
              {isUploading ? "Importing..." : "Bulk Import"}
            </Button>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* ───────────────── TELEMETRY CARDS ───────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="group overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total Partners
              </p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  suppliers.length
                )}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                Registered vendors
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Active Categories
              </p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 transition-transform group-hover:scale-110">
                <Layers className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  categoriesList.length
                )}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                Unique supply types
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Top Category
              </p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-transform group-hover:scale-110">
                <Tag className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold tracking-tight text-foreground truncate">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  topCategory
                )}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                Most frequent sector
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ───────────────── ADD SUPPLIER CARD ───────────────── */}
      <Card className="overflow-hidden border-border/70 bg-card shadow-sm transition-all hover:shadow-md">
        <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
          <CardTitle className="text-base font-bold">
            Register New Supplier
          </CardTitle>
          <CardDescription className="text-xs">
            Add a new vendor to your supply chain directory.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-6">
          <form
            onSubmit={handleCreateSupplier}
            className="grid grid-cols-1 gap-5 md:grid-cols-12 items-end"
          >
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Company Name
              </label>
              <Input
                required
                placeholder="e.g. Apex Global Supply"
                className="h-10 bg-background/50"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Contact Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  required
                  type="email"
                  placeholder="orders@apex.com"
                  className="h-10 pl-9 bg-background/50"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Category
              </label>
              <Input
                required
                placeholder="Electronics, Packaging..."
                className="h-10 bg-background/50"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Phone
              </label>
              <div className="flex gap-2">
                <div className="relative w-full">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    required
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="h-10 pl-9 bg-background/50"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="icon"
                  className="h-10 w-10 shrink-0 shadow-sm"
                  title="Add Supplier"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ───────────────── SUPPLIER DIRECTORY TABLE ───────────────── */}
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
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" /> Category:
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-10 w-[180px] bg-card border-border/70 shadow-sm">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoriesList.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
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
                  <TableHead className="h-12 pl-6 text-xs font-bold uppercase tracking-wider w-[300px]">
                    Supplier Identity
                  </TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">
                    Contact Email
                  </TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">
                    Phone
                  </TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">
                    Category
                  </TableHead>
                  <TableHead className="h-12 pr-6 text-right text-xs font-bold uppercase tracking-wider">
                    Actions
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
                          Fetching vendor directory...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FileX2 className="h-10 w-10 mb-4 opacity-50" />
                        <p className="text-sm font-medium text-foreground">
                          No suppliers found
                        </p>
                        <p className="text-xs mt-1">
                          Adjust filters or register a new vendor.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSuppliers.map((supplier) => (
                    <TableRow
                      key={supplier._id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      {/* Identity */}
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-primary/10 text-primary">
                            <Building className="h-5 w-5" />
                          </div>
                          <span className="font-semibold text-sm text-foreground">
                            {supplier.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Mail className="h-4 w-4 shrink-0 text-primary/70" />
                          <span>{supplier.contact}</span>
                        </div>
                      </TableCell>

                      {/* Phone */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Phone className="h-4 w-4 shrink-0 text-primary/70" />
                          <span>{supplier.phone}</span>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="py-4">
                        <Badge
                          variant="secondary"
                          className="px-2.5 py-1 text-xs font-bold tracking-wider bg-muted/60"
                        >
                          <Tag className="mr-1.5 h-3 w-3 text-muted-foreground" />
                          {supplier.category}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4 pr-6 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSupplier(supplier._id)}
                          className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          title="Delete Supplier"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION FOOTER */}
          {!isLoading && filteredSuppliers.length > 0 && (
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
                    filteredSuppliers.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-bold text-foreground">
                  {filteredSuppliers.length}
                </span>{" "}
                suppliers
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
