import React, { useState, useEffect, useRef } from "react";
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
  X,
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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    category: "",
    phone: "",
  });

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(API_SUPPLIERS, {
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch suppliers");
      }

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

  // Reset pagination when filters change
  const resetPagination = () => {
    setCurrentPage(1);
  };

  // Get unique categories
  const categories = [
    ...new Set(
      suppliers.map((supplier) => supplier.category?.trim()).filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));

  // Search and category filtering
  const filteredSuppliers = suppliers.filter((supplier) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch = [
      supplier.name,
      supplier.contact,
      supplier.phone,
    ].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(search),
    );

    const matchesCategory =
      selectedCategory === "all" ||
      supplier.category?.trim() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const startIndex =
    filteredSuppliers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endIndex = Math.min(
    currentPage * itemsPerPage,
    filteredSuppliers.length,
  );

  // Add supplier
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

      const createdSupplier = result.data || result;

      setSuppliers((prev) => [createdSupplier, ...prev]);
      setFormData({
        name: "",
        contact: "",
        category: "",
        phone: "",
      });

      setSearchTerm("");
      setSelectedCategory("all");
      setCurrentPage(1);
    } catch (error) {
      console.error("Error creating supplier:", error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete supplier
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

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Failed to delete supplier");
      }

      setSuppliers((prev) => prev.filter((supplier) => supplier._id !== id));

      // Keep the current page valid after deletion
      setCurrentPage((page) =>
        Math.min(
          page,
          Math.max(1, Math.ceil((filteredSuppliers.length - 1) / itemsPerPage)),
        ),
      );
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert(error.message);
    }
  };

  // Download CSV template
  const downloadTemplate = () => {
    const csvContent = [
      "name,contact,category,phone",
      "Apex Supplies,orders@apex.com,Packaging,+15551234567",
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "flowbox_suppliers_template.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  // Trigger CSV file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Import suppliers from CSV
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setIsUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: async (results) => {
        try {
          if (results.errors.length > 0) {
            throw new Error(
              "Some rows could not be parsed. Please check your CSV.",
            );
          }

          const parsedSuppliers = results.data.map((row) => ({
            name: String(row.name || "").trim(),
            contact: String(row.contact || "").trim(),
            category: String(row.category || "").trim(),
            phone: String(row.phone || "").trim(),
          }));

          const validSuppliers = parsedSuppliers.filter(
            (supplier) =>
              supplier.name &&
              supplier.contact &&
              supplier.category &&
              supplier.phone,
          );

          if (validSuppliers.length === 0) {
            throw new Error(
              "No valid suppliers found. Check your CSV headers and data.",
            );
          }

          const response = await fetch(`${API_SUPPLIERS}/bulk`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              suppliers: validSuppliers,
            }),
          });

          if (response.status === 401) {
            navigate("/login");
            return;
          }

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to import suppliers");
          }

          alert(data.message || "Suppliers imported successfully!");

          setSearchTerm("");
          setSelectedCategory("all");
          setCurrentPage(1);

          await fetchSuppliers();
        } catch (error) {
          alert(`Import failed: ${error.message}`);
        } finally {
          setIsUploading(false);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      },

      error: () => {
        alert("Error reading CSV file.");
        setIsUploading(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        {/* CSV Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Template
          </Button>

          <Button size="sm" onClick={triggerFileInput} disabled={isUploading}>
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}

            {isUploading ? "Importing..." : "Import CSV"}
          </Button>

          <input
            type="file"
            accept=".csv,text/csv"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Add Supplier */}
      <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <CardTitle className="text-lg">Add Supplier</CardTitle>

          <CardDescription>
            Register a new vendor to your supply chain directory.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4">
          <form
            onSubmit={handleCreateSupplier}
            className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Company Name
              </label>

              <Input
                required
                placeholder="Apex Global Supply"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </div>

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
                  setFormData({
                    ...formData,
                    contact: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Category
              </label>

              <Input
                required
                placeholder="Electronics, Packaging..."
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Phone Number
              </label>

              <div className="flex gap-2">
                <Input
                  required
                  type="tel"
                  placeholder="+1 (555) 234-5678"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
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

      {/* Search and Category Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search name, email, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              resetPagination();
            }}
            className="pl-9 pr-9"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                resetPagination();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            resetPagination();
          }}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring sm:w-52"
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSearchTerm("");
            setSelectedCategory("all");
            resetPagination();
          }}
          disabled={!searchTerm && selectedCategory === "all"}
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Suppliers Table */}
      <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
        <div className="overflow-x-auto">
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
              ) : filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {suppliers.length === 0
                      ? "No suppliers found. Import a CSV to get started."
                      : "No suppliers match your search or category filter."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSuppliers.map((supplier) => (
                  <TableRow
                    key={supplier._id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Building className="h-4 w-4" />
                        </div>

                        <span className="font-medium text-foreground">
                          {supplier.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 shrink-0 text-muted-foreground/70" />

                        <span>{supplier.contact}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="border border-border bg-secondary text-secondary-foreground"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {supplier.category}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 shrink-0 text-muted-foreground/70" />

                        <span>{supplier.phone}</span>
                      </div>
                    </TableCell>

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
        </div>
      </Card>

      {/* Pagination */}
      {!isLoading && filteredSuppliers.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {startIndex}-{endIndex}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {filteredSuppliers.length}
            </span>{" "}
            suppliers
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                resetPagination();
              }}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
              aria-label="Suppliers per page"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <Button
              variant="outline"
              size="icon"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="min-w-24 text-center text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
