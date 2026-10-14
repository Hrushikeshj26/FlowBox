import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightLeft,
  Building2,
  Package,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
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
const API_WAREHOUSES = "http://localhost:5000/api/warehouses"; // Change to /api/stores if your server.js uses /api/stores
const API_TRANSFER = "http://localhost:5000/api/inventory/transfer";

// Helper to get headers with token
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

  const [formData, setFormData] = useState({
    productId: "",
    targetStoreId: "",
    quantity: "",
  });

  // 1. Fetch logged-in user's products and warehouses
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

      if (productsRes.ok) {
        setProducts(await productsRes.json());
      }
      if (warehousesRes.ok) {
        setWarehouses(await warehousesRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch transfer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransferData();
  }, []);

  // Find currently selected product and its current warehouse
  const selectedProduct = products.find((p) => p._id === formData.productId);
  const sourceStoreId =
    selectedProduct?.storeId?._id || selectedProduct?.storeId || "";
  const sourceStoreName =
    selectedProduct?.storeId?.name ||
    warehouses.find((w) => w._id === sourceStoreId)?.name ||
    "Unassigned";

  // Filter out the source warehouse from destination options
  const availableTargetWarehouses = warehouses.filter(
    (w) => w._id !== sourceStoreId,
  );

  // 2. Execute stock transfer
  const handleTransfer = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: "", text: "" });

    if (!formData.productId || !formData.targetStoreId || !formData.quantity) {
      setStatusMessage({
        type: "error",
        text: "Please select a product, destination warehouse, and quantity.",
      });
      return;
    }

    const transferQty = Number(formData.quantity);

    if (selectedProduct && transferQty > selectedProduct.stockCount) {
      setStatusMessage({
        type: "error",
        text: `Insufficient stock. Only ${selectedProduct.stockCount} units available.`,
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
          fromStoreId: sourceStoreId,
          toStoreId: formData.targetStoreId,
          quantity: transferQty,
        }),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to transfer inventory");
      }

      setStatusMessage({
        type: "success",
        text: data.message || "Stock transferred successfully!",
      });

      setFormData({
        productId: "",
        targetStoreId: "",
        quantity: "",
      });

      // Refresh products and warehouse capacity loads
      await fetchTransferData();
    } catch (error) {
      console.error("Transfer error:", error.message);
      setStatusMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Inventory Transfers
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Move stock between your warehouses and automatically rebalance
          facility load.
        </p>
      </div>

      {/* ───────────────── TRANSFER FORM CARD ───────────────── */}
      <Card className="border-border bg-card overflow-hidden p-0 shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <CardTitle className="text-lg">Initiate Stock Transfer</CardTitle>
          <CardDescription>
            Select an item, choose a destination facility, and specify the
            quantity to move.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {statusMessage.text && (
            <div
              className={`mb-6 flex items-center gap-2 rounded-md border p-3 text-sm ${
                statusMessage.type === "error"
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {statusMessage.type === "error" ? (
                <AlertCircle className="h-4 w-4 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form
            onSubmit={handleTransfer}
            className="grid grid-cols-1 items-start gap-4 md:grid-cols-4"
          >
            {/* 1. Select Product */}
            <div className="space-y-2">
              {/* Added "block" to the label class below */}
              <label className="block text-sm font-medium text-foreground">
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product..." />
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

            {/* 2. Source Warehouse (Read-Only Indicator) */}
            <div className="space-y-2">
              {/* Added "block" here */}
              <label className="block text-sm font-medium text-foreground">
                Origin Warehouse
              </label>
              <Input
                disabled
                value={
                  selectedProduct ? sourceStoreName : "Select a product first"
                }
                className="bg-muted/50 text-muted-foreground"
              />
            </div>

            {/* 3. Destination Warehouse */}
            <div className="space-y-2">
              {/* Added "block" here */}
              <label className="block text-sm font-medium text-foreground">
                Destination Warehouse
              </label>
              <Select
                required
                disabled={!selectedProduct}
                value={formData.targetStoreId}
                onValueChange={(value) =>
                  setFormData({ ...formData, targetStoreId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select destination..." />
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
                        {store.name} ({availableSpace} units free)
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* 4. Quantity + Submit */}
            <div className="space-y-2">
              {/* Added "block" here */}
              <label className="block text-sm font-medium text-foreground">
                Quantity
              </label>
              <div className="flex gap-2">
                <Input
                  required
                  type="number"
                  min="1"
                  max={selectedProduct?.stockCount || undefined}
                  placeholder="Units"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedProduct}
                  className="shrink-0 gap-1.5"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Move</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ───────────────── CURRENT STOCK DISTRIBUTION TABLE ───────────────── */}
      <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <CardTitle className="text-lg">
            Stock Distribution by Warehouse
          </CardTitle>
          <CardDescription>
            Current product locations and warehouse capacity utilization.
          </CardDescription>
        </CardHeader>

        <Table>
          <TableHeader className="border-b border-border bg-muted/70 dark:bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-foreground">
                Product
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Assigned Warehouse
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Available Units
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Warehouse Capacity
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Loading stock locations...
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No products in inventory to transfer.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const storeObj =
                  warehouses.find(
                    (w) => w._id === (product.storeId?._id || product.storeId),
                  ) || product.storeId;

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

                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span>{storeObj?.name || "Unassigned"}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">
                        {product.stockCount} units
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right text-sm text-muted-foreground">
                      {storeObj?.capacity
                        ? `${storeObj.currentLoad || 0} / ${storeObj.capacity} units`
                        : "—"}
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
