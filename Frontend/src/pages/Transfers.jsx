import React, { useEffect, useState } from "react";
import { ArrowRightLeft, Package, Building2, AlertCircle } from "lucide-react";

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

export default function Transfers() {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    productId: "",
    targetStoreId: "",
    quantity: "",
  });

  const fetchData = async () => {
    try {
      const [productsRes, storesRes] = await Promise.all([
        fetch("http://localhost:5000/api/products"),
        fetch("http://localhost:5000/api/stores"),
      ]);

      if (productsRes.ok) {
        setProducts(await productsRes.json());
      }

      if (storesRes.ok) {
        setStores(await storesRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransferSubmit = async (e) => {
    e.preventDefault();

    const selectedProduct = products.find(
      (product) => product._id === formData.productId,
    );

    const sourceStoreId =
      selectedProduct?.storeId?._id || selectedProduct?.storeId;

    if (!sourceStoreId) {
      alert("The selected product has no source location.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/inventory/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: formData.productId,
            sourceStoreId,
            targetStoreId: formData.targetStoreId,
            quantity: Number(formData.quantity),
          }),
        },
      );

      if (response.ok) {
        setFormData({
          productId: "",
          targetStoreId: "",
          quantity: "",
        });

        await fetchData();

        alert("Transfer successful!");
      } else {
        const errorData = await response.json();
        alert(`Transfer failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error transferring stock:", error);
      alert("Something went wrong while transferring stock.");
    }
  };

  // Currently selected product
  const selectedProduct = products.find(
    (product) => product._id === formData.productId,
  );

  const currentStoreId =
    selectedProduct?.storeId?._id || selectedProduct?.storeId;

  const currentStoreName =
    stores.find((store) => store._id === currentStoreId)?.name ||
    "Unknown location";

  return (
    <div className="space-y-6">
      {/* ───────────────── HEADER ───────────────── */}

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ArrowRightLeft className="h-5 w-5" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Stock Transfers
          </h1>
        </div>

        <p className="text-sm text-muted-foreground">
          Move inventory between your warehouses and facilities.
        </p>
      </div>

      {/* ───────────────── MAIN CONTENT ───────────────── */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ───────────────── TRANSFER FORM ───────────────── */}

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Execute Transfer</CardTitle>

            <CardDescription>
              Select a product and destination to move stock.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleTransferSubmit} className="space-y-5">
              {/* Product */}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Select Product
                </label>

                <Select
                  required
                  value={formData.productId}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      productId: value,
                      quantity: "",
                      targetStoreId: "",
                    })
                  }
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Choose product..." />
                  </SelectTrigger>

                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem
                        key={product._id}
                        value={product._id}
                        disabled={product.stockCount <= 0}
                      >
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Product Information */}

              {selectedProduct && (
                <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                      Current Location
                    </span>

                    <span className="text-right text-sm font-medium text-foreground">
                      {currentStoreName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                      Available Stock
                    </span>

                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {selectedProduct.stockCount} units
                    </Badge>
                  </div>
                </div>
              )}

              {/* Destination */}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Destination Warehouse
                </label>

                <Select
                  required
                  disabled={!formData.productId}
                  value={formData.targetStoreId}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      targetStoreId: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select destination..." />
                  </SelectTrigger>

                  <SelectContent>
                    {stores
                      .filter((store) => store._id !== currentStoreId)
                      .map((store) => (
                        <SelectItem key={store._id} value={store._id}>
                          {store.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Quantity to Move
                </label>

                <Input
                  required
                  disabled={!formData.productId}
                  type="number"
                  min="1"
                  max={selectedProduct?.stockCount || 1}
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: e.target.value,
                    })
                  }
                  className="bg-background"
                />

                {selectedProduct && (
                  <p className="text-xs text-muted-foreground">
                    Maximum available: {selectedProduct.stockCount} units
                  </p>
                )}
              </div>

              {/* Warning */}

              {selectedProduct && selectedProduct.stockCount <= 5 && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    This product is running low on stock. Consider reviewing
                    your inventory before transferring.
                  </p>
                </div>
              )}

              {/* Submit */}

              <Button
                type="submit"
                disabled={
                  !formData.productId ||
                  !formData.targetStoreId ||
                  !formData.quantity ||
                  Number(formData.quantity) <= 0
                }
                className="mt-2 w-full"
              >
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Move Stock
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ───────────────── STOCK DIRECTORY ───────────────── */}

        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
            <CardTitle className="text-lg">Current Stock Directory</CardTitle>

            <CardDescription>
              Live view of all inventory locations.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              {/* Different table header color */}

              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="h-11 font-semibold text-foreground">
                    Product
                  </TableHead>

                  <TableHead className="h-11 font-semibold text-foreground">
                    Location
                  </TableHead>

                  <TableHead className="h-11 text-right font-semibold text-foreground">
                    Stock
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Loading inventory...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    const storeId = product.storeId?._id || product.storeId;

                    const storeName =
                      stores.find((store) => store._id === storeId)?.name ||
                      "Unassigned";

                    const isLowStock = product.stockCount <= 5;

                    return (
                      <TableRow
                        key={product._id}
                        className="transition-colors hover:bg-muted/40"
                      >
                        {/* Product */}

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

                        {/* Location */}

                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="h-4 w-4 text-muted-foreground/70" />

                            {storeName}
                          </div>
                        </TableCell>

                        {/* Stock */}

                        <TableCell className="text-right">
                          <Badge
                            variant="outline"
                            className={
                              isLowStock
                                ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "border-border bg-muted/50 text-foreground"
                            }
                          >
                            {product.stockCount}
                            {isLowStock && " Low"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
