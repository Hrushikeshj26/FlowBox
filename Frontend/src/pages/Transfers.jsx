import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightLeft,
  Building2,
  Package,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileX2,
  MoveRight,
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

const API_PRODUCTS = "http://localhost:5000/api/products";
const API_WAREHOUSES = "http://localhost:5000/api/warehouses";
const API_TRANSFER = "http://localhost:5000/api/inventory/transfer";

const getAuthHeaders = () => {
  const token = localStorage.getItem("flowbox_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export default function Transfers() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Search, Filter & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    productId: "",
    targetStoreId: "",
    quantity: "",
  });

  const fetchTransferData = async () => {
    try {
      const headers = getAuthHeaders();
      const [productsRes, warehousesRes] = await Promise.all([
        fetch(API_PRODUCTS, { headers }),
        fetch(API_WAREHOUSES, { headers }),
      ]);

      if (productsRes.status === 401 || warehousesRes.status === 401) {
        navigate("/login");
        return;
      }

      if (productsRes.ok) setProducts(await productsRes.json());
      if (warehousesRes.ok) setWarehouses(await warehousesRes.json());
    } catch (error) {
      console.error("Failed to fetch transfer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransferData();
  }, []);

  // Compute selected product details for the form
  const selectedProduct = products.find((p) => p._id === formData.productId);
  const sourceStoreId =
    selectedProduct?.storeId?._id || selectedProduct?.storeId || "";
  const sourceStoreName =
    selectedProduct?.storeId?.name ||
    warehouses.find((w) => w._id === sourceStoreId)?.name ||
    "Unassigned";

  const availableTargetWarehouses = warehouses.filter(
    (w) => w._id !== sourceStoreId,
  );

  // --- Filtering & Pagination Logic ---
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const storeObj =
        warehouses.find((w) => w._id === (p.storeId?._id || p.storeId)) ||
        p.storeId;
      const matchesSearch = p.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesWarehouse =
        warehouseFilter === "All" ||
        (storeObj && storeObj._id === warehouseFilter);
      return matchesSearch && matchesWarehouse;
    });
  }, [products, warehouses, searchQuery, warehouseFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: "", text: "" });

    if (!formData.productId || !formData.targetStoreId || !formData.quantity) {
      setStatusMessage({
        type: "error",
        text: "Please complete all fields to execute transfer.",
      });
      return;
    }

    const transferQty = Number(formData.quantity);

    if (selectedProduct && transferQty > selectedProduct.stockCount) {
      setStatusMessage({
        type: "error",
        text: `Insufficient stock. Only ${selectedProduct.stockCount} units available in ${sourceStoreName}.`,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(API_TRANSFER, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productId: formData.productId,
          sourceStoreId,
          targetStoreId: formData.targetStoreId,
          fromStoreId: sourceStoreId, // depending on your backend expectation
          toStoreId: formData.targetStoreId, // depending on your backend expectation
          quantity: transferQty,
        }),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to transfer inventory");

      setStatusMessage({
        type: "success",
        text: data.message || "Stock transferred successfully!",
      });
      setFormData({ productId: "", targetStoreId: "", quantity: "" });
      await fetchTransferData();

      // Clear success message after 4s
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
    } catch (error) {
      console.error("Transfer error:", error.message);
      setStatusMessage({ type: "error", text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-12 pt-2">
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/65 pb-6 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <ArrowRightLeft className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Inventory Transfers
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Reallocate stock between facilities and automatically balance
            warehouse loads.
          </p>
        </div>
      </div>

      {/* ───────────────── TRANSFER FORM CARD ───────────────── */}
      <Card className="overflow-hidden border-border/70 bg-card shadow-sm transition-all hover:shadow-md">
        <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
          <CardTitle className="text-base font-bold">
            Initiate Stock Transfer
          </CardTitle>
          <CardDescription className="text-xs">
            FlowBox checks capacity limits before allowing stock to be moved.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-6">
          {statusMessage.text && (
            <div
              className={`mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-medium shadow-sm ${
                statusMessage.type === "error"
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {statusMessage.type === "error" ? (
                <AlertTriangle className="h-5 w-5 shrink-0" />
              ) : (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form
            onSubmit={handleTransfer}
            className="grid grid-cols-1 gap-5 md:grid-cols-12 items-end"
          >
            {/* 1. Select Product */}
            <div className="space-y-2 md:col-span-4">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Product to Move
              </label>
              <Select
                required
                value={formData.productId}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    productId: value,
                    targetStoreId: "",
                  })
                }
              >
                <SelectTrigger className="h-10 w-full bg-background/50">
                  <SelectValue placeholder="Select inventory item..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => {
                    const locName =
                      product.storeId?.name ||
                      warehouses.find((w) => w._id === product.storeId)?.name ||
                      "Unassigned";
                    return (
                      <SelectItem
                        key={product._id}
                        value={product._id}
                        disabled={product.stockCount <= 0}
                      >
                        {product.name} ({product.stockCount} in {locName})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Source Warehouse */}
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Origin
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  disabled
                  value={
                    selectedProduct ? sourceStoreName : "Select product first"
                  }
                  className="h-10 pl-9 bg-muted/50 text-muted-foreground border-dashed"
                />
              </div>
            </div>

            {/* 3. Destination Warehouse */}
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Destination
              </label>
              <Select
                required
                disabled={!selectedProduct}
                value={formData.targetStoreId}
                onValueChange={(value) =>
                  setFormData({ ...formData, targetStoreId: value })
                }
              >
                <SelectTrigger className="h-10 w-full bg-background/50">
                  <SelectValue placeholder="Target facility..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTargetWarehouses.map((store) => {
                    const availableSpace = store.capacity - store.currentLoad;
                    return (
                      <SelectItem
                        key={store._id}
                        value={store._id}
                        disabled={availableSpace <= 0}
                      >
                        {store.name} ({availableSpace} free)
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* 4. Quantity + Submit */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Units
              </label>
              <div className="flex gap-2">
                <Input
                  required
                  type="number"
                  min="1"
                  max={selectedProduct?.stockCount || undefined}
                  placeholder="Qty"
                  className="h-10 bg-background/50"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="md:col-span-12 flex justify-end mt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !selectedProduct}
                className="h-10 px-8 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Moving...
                  </>
                ) : (
                  <>
                    <MoveRight className="mr-2 h-4 w-4" /> Execute Transfer
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ───────────────── CURRENT STOCK DISTRIBUTION TABLE ───────────────── */}
      <div className="space-y-4">
        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search product inventory..."
              className="pl-9 h-10 w-full bg-card shadow-sm border-border/70"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" /> View:
            </div>
            <Select
              value={warehouseFilter}
              onValueChange={(v) => {
                setWarehouseFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-10 w-[180px] bg-card border-border/70 shadow-sm">
                <SelectValue placeholder="All Warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Warehouses</SelectItem>
                {warehouses.map((w) => (
                  <SelectItem key={w._id} value={w._id}>
                    {w.name}
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
                  <TableHead className="h-12 pl-6 text-xs font-bold uppercase tracking-wider">
                    Product
                  </TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">
                    Assigned Node
                  </TableHead>
                  <TableHead className="h-12 text-xs font-bold uppercase tracking-wider">
                    Available Units
                  </TableHead>
                  <TableHead className="h-12 pr-6 text-right text-xs font-bold uppercase tracking-wider">
                    Node Capacity
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
                          Loading network distribution...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FileX2 className="h-10 w-10 mb-4 opacity-50" />
                        <p className="text-sm font-medium text-foreground">
                          No distribution records found
                        </p>
                        <p className="text-xs mt-1">
                          Adjust your filters or add products to the system.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => {
                    const storeObj =
                      warehouses.find(
                        (w) =>
                          w._id === (product.storeId?._id || product.storeId),
                      ) || product.storeId;
                    const capacity = storeObj?.capacity || 0;
                    const load = storeObj?.currentLoad || 0;
                    const utilization =
                      capacity > 0 ? (load / capacity) * 100 : 0;
                    const isNearCap = utilization > 85;

                    return (
                      <TableRow
                        key={product._id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-muted/50 text-muted-foreground shrink-0">
                              <Package className="h-4 w-4" />
                            </div>
                            <span className="font-semibold text-sm text-foreground">
                              {product.name}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Building2 className="h-4 w-4 shrink-0 text-primary" />
                            <span>{storeObj?.name || "Unassigned"}</span>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <Badge
                            variant="secondary"
                            className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider"
                          >
                            {product.stockCount} units
                          </Badge>
                        </TableCell>

                        <TableCell className="py-4 pr-6 text-right">
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="text-sm font-semibold tabular-nums text-foreground">
                              {capacity ? `${load} / ${capacity}` : "—"}
                            </span>
                            {capacity > 0 && (
                              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                                <div
                                  className={`h-full rounded-full transition-all ${isNearCap ? "bg-amber-500" : "bg-primary"}`}
                                  style={{ width: `${utilization}%` }}
                                />
                              </div>
                            )}
                          </div>
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
