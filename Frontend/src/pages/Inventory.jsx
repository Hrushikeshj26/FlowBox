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
  Filter,
  ChevronLeft,
  ChevronRight,
  Building2,
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

const formatCurrency = (value) =>
  `$${(Number(value) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function Inventory() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [importStoreId, setImportStoreId] = useState("");
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Search, Filter & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("All");
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

  // 1. Filter products based on search query and warehouse filter
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const storeId = p.storeId?._id || p.storeId;
      const storeName =
        p.storeId?.name || stores.find((s) => s._id === storeId)?.name || "";

      const matchesSearch =
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        storeName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesWarehouse =
        warehouseFilter === "All" || storeId === warehouseFilter;

      return matchesSearch && matchesWarehouse;
    });
  }, [products, stores, searchQuery, warehouseFilter]);

  // 2. Paginate the filtered results
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, warehouseFilter]);

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
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this product?",
      )
    )
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
    <div className="mx-auto max-w-[1600px] space-y-8 pb-12 pt-2">
      {/* ───────────────── HEADER & CSV ACTIONS ───────────────── */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/65 pb-6 lg:flex-row lg:items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <PackageSearch className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Inventory Catalog
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your global product catalog, track stock levels, and
            provision new items.
          </p>
        </div>

        {/* CSV Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-lg border border-border/50">
            <Select value={importStoreId} onValueChange={setImportStoreId}>
              <SelectTrigger className="h-9 w-[180px] bg-background border-border/70 shadow-sm text-xs">
                <SelectValue placeholder="Target warehouse..." />
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

      {/* ───────────────── ADD PRODUCT CARD ───────────────── */}
      <Card className="overflow-hidden border-border/70 bg-card shadow-sm transition-all hover:shadow-md">
        <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
          <CardTitle className="text-base font-bold">
            Add Single Product
          </CardTitle>
          <CardDescription className="text-xs">
            Manually register a new item to a specific facility.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-12 items-end"
          >
            <div className="space-y-2 md:col-span-4">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Product Name
              </label>
              <Input
                required
                placeholder="e.g. Industrial Servo Motor"
                value={formData.name}
                className="h-10 bg-background/50"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Unit Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
                <Input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="h-10 pl-7 bg-background/50"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Stock Count
              </label>
              <Input
                required
                type="number"
                min="0"
                placeholder="0"
                className="h-10 bg-background/50"
                value={formData.stockCount}
                onChange={(e) =>
                  setFormData({ ...formData, stockCount: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Storage Node
              </label>
              <Select
                required
                value={formData.storeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, storeId: value })
                }
              >
                <SelectTrigger className="h-10 w-full bg-background/50">
                  <SelectValue placeholder="Assign warehouse..." />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store._id} value={store._id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-1 flex justify-end">
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 shrink-0 shadow-sm"
                title="Add Product"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ───────────────── PRODUCT TABLE DIRECTORY ───────────────── */}
      <div className="space-y-4">
        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, SKU, or location..."
              className="pl-9 h-10 w-full bg-card shadow-sm border-border/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" /> View:
            </div>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="h-10 w-[160px] bg-card border-border/70 shadow-sm">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Locations</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store._id} value={store._id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* TABLE CARD */}
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40 border-b border-border/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-12 pl-6 text-xs font-bold uppercase tracking-wider w-[350px]">
                    Product Details
                  </TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">
                    Unit Value
                  </TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">
                    Availability
                  </TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">
                    Assigned Node
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
                          Loading catalog...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FileX2 className="h-10 w-10 mb-4 opacity-50" />
                        <p className="text-sm font-medium text-foreground">
                          No products found
                        </p>
                        <p className="text-xs mt-1">
                          Adjust your filters or add new stock.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => {
                    const storeName =
                      product.storeId?.name ||
                      stores.find((s) => s._id === product.storeId)?.name ||
                      "Unassigned";
                    const stock = Number(product.stockCount) || 0;

                    // Dynamic Stock Styling
                    let stockVariant = "secondary";
                    let stockStyles = "";
                    if (stock === 0) {
                      stockVariant = "outline";
                      stockStyles =
                        "border-destructive/30 bg-destructive/10 text-destructive";
                    } else if (stock < 15) {
                      stockVariant = "outline";
                      stockStyles =
                        "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-500";
                    }

                    return (
                      <TableRow
                        key={product._id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-muted/50 text-muted-foreground shrink-0">
                              <Package className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm text-foreground">
                                {product.name}
                              </span>
                              {product.sku && (
                                <span className="text-xs font-mono text-muted-foreground mt-0.5">
                                  {product.sku}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <span className="font-bold text-sm tabular-nums text-foreground">
                            {formatCurrency(product.price)}
                          </span>
                        </TableCell>

                        <TableCell className="py-4">
                          <Badge
                            variant={stockVariant}
                            className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${stockStyles}`}
                          >
                            {stock} units
                          </Badge>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Building2 className="h-4 w-4 shrink-0 text-primary" />
                            <span>{storeName}</span>
                          </div>
                        </TableCell>

                        <TableCell className="py-4 pr-6 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product._id)}
                            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            title="Delete Product"
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

          {/* PAGINATION FOOTER */}
          {!isLoading && filteredProducts.length > 0 && (
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
                    filteredProducts.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-bold text-foreground">
                  {filteredProducts.length}
                </span>{" "}
                items
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
