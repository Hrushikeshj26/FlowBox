import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import {
  PackageSearch,
  Plus,
  Trash2,
  MapPin,
  Package,
  UploadCloud,
  Download,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
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
import { toast } from "sonner";

const API_PRODUCTS = "http://localhost:5000/api/products";
const API_WAREHOUSES = "http://localhost:5000/api/warehouses";

const getAuthHeaders = () => {
  const token = localStorage.getItem("flowbox_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export default function Inventory() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [importStoreId, setImportStoreId] = useState("");
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Search & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stockCount: "",
    storeId: "",
  });

  const fetchData = async () => {
    try {
      const [productsRes, storesRes] = await Promise.all([
        fetch(API_PRODUCTS, { headers: getAuthHeaders() }),
        fetch(API_WAREHOUSES, { headers: getAuthHeaders() }),
      ]);

      if (productsRes.status === 401 || storesRes.status === 401) {
        navigate("/login");
        return;
      }

      if (productsRes.ok) setProducts(await productsRes.json());
      if (storesRes.ok) setStores(await storesRes.json());
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 1. Filter products based on live search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter((p) => {
      const storeName =
        p.storeId?.name || stores.find((s) => s._id === p.storeId)?.name || "";
      return (
        p.name?.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query) ||
        storeName.toLowerCase().includes(query)
      );
    });
  }, [products, stores, searchQuery]);

  // 2. Paginate the filtered results
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 whenever search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Keep pagination in bounds if items are deleted or filtered
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Standard Single Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.storeId) {
      toast.error("Please select a warehouse location.");
      return;
    }

    try {
      const response = await fetch(API_PRODUCTS, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          stockCount: Number(formData.stockCount),
          storeId: formData.storeId,
        }),
      });

      if (response.status === 401) return navigate("/login");
      if (!response.ok) throw new Error("Failed to create product");

      setFormData({ name: "", price: "", stockCount: "", storeId: "" });
      toast.success("Product added successfully!");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const response = await fetch(`${API_PRODUCTS}/${productId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (response.status === 401) return navigate("/login");
      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        toast.success("Product deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // ───────────────── CSV IMPORT LOGIC ─────────────────
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const downloadTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,name,price,stockCount\nExample Product,19.99,150";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "flowbox_inventory_template.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!importStoreId) {
      toast.error("Please select a destination warehouse before importing.");
      fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const parsedProducts = results.data.map((row) => ({
            name: row.name?.trim(),
            price: Number(row.price) || 0,
            stockCount: Number(row.stockCount) || 0,
            storeId: importStoreId,
          }));

          const response = await fetch(`${API_PRODUCTS}/bulk`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ products: parsedProducts }),
          });

          if (response.status === 401) return navigate("/login");

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          toast.success(data.message || "CSV imported successfully!");
          fetchData();
        } catch (error) {
          toast.error(`Import failed: ${error.message}`);
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
      error: () => {
        toast.error("Error reading CSV file.");
        setIsUploading(false);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER WITH IMPORT ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
            <PackageSearch className="h-7 w-7 text-primary" />
            Inventory
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog, stock levels, and storage locations.
          </p>
        </div>

        {/* CSV Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Select value={importStoreId} onValueChange={setImportStoreId}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Import to warehouse..." />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store._id} value={store._id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Template
          </Button>

          <Button size="sm" onClick={triggerFileInput} disabled={isUploading}>
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4 mr-2" />
            )}
            {isUploading ? "Importing..." : "Import CSV"}
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

      {/* ADD PRODUCT CARD */}
      <Card className="border-border bg-card p-0 overflow-hidden shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <CardTitle className="text-lg text-card-foreground">
            Add Product
          </CardTitle>
          <CardDescription>
            Add a single item to a specific warehouse location.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 items-end gap-4 md:grid-cols-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Product Name
              </label>
              <Input
                required
                placeholder="Product name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Price
              </label>
              <Input
                required
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Stock Count
              </label>
              <Input
                required
                type="number"
                min="0"
                placeholder="0"
                value={formData.stockCount}
                onChange={(e) =>
                  setFormData({ ...formData, stockCount: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Location
              </label>
              <div className="flex gap-2">
                <Select
                  required
                  value={formData.storeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, storeId: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select warehouse..." />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store._id} value={store._id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  size="icon"
                  className="shrink-0 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* PRODUCT TABLE & SEARCH CONTAINER */}
      <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
        {/* Live Search Bar Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/20 px-6 py-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by product name, SKU, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-background text-sm"
            />
          </div>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear filter
            </Button>
          )}
        </div>

        <Table>
          <TableHeader className="border-b border-border bg-muted/70 dark:bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px] font-semibold text-foreground">
                Product Name
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Price
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Stock
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Location
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
                  <Loader2 className="h-4 w-4 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  {searchQuery
                    ? `No products matching "${searchQuery}".`
                    : "No products found. Add one above or import a CSV."}
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => {
                const storeName =
                  product.storeId?.name ||
                  stores.find((store) => store._id === product.storeId)?.name ||
                  "Unassigned";

                return (
                  <TableRow
                    key={product._id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Package className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-foreground">
                          {product.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      $
                      {(product.price || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {product.stockCount} units
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{storeName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product._id)}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
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

        {/* PAGINATION FOOTER CONTROLS */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-3">
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {Math.min(
                  (currentPage - 1) * itemsPerPage + 1,
                  filteredProducts.length,
                )}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filteredProducts.length}
              </span>{" "}
              filtered products
              {filteredProducts.length !== products.length &&
                ` (from ${products.length} total)`}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 px-3 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
              </Button>

              <span className="text-xs font-medium text-foreground px-2">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="h-8 px-3 text-xs"
              >
                Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
