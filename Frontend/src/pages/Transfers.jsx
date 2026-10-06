import React, { useState, useEffect } from "react";
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

  const handleTransferSubmit = async (e) => {
    e.preventDefault();

    const selectedProduct = products.find((p) => p._id === formData.productId);
    const sourceStoreId =
      selectedProduct?.storeId?._id || selectedProduct?.storeId;

    try {
      const response = await fetch(
        "http://localhost:5000/api/inventory/transfer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: formData.productId,
            sourceStoreId: sourceStoreId,
            targetStoreId: formData.targetStoreId,
            quantity: Number(formData.quantity),
          }),
        },
      );

      if (response.ok) {
        setFormData({ productId: "", targetStoreId: "", quantity: "" });
        await fetchData();
        alert("Transfer successful!");
      } else {
        const errorData = await response.json();
        alert(`Transfer failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error transferring stock:", error);
    }
  };

  // Derived state for the currently selected product
  const selectedProduct = products.find((p) => p._id === formData.productId);
  const currentStoreId =
    selectedProduct?.storeId?._id || selectedProduct?.storeId;
  const currentStoreName =
    stores.find((s) => s._id === currentStoreId)?.name || "Unknown";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
          <ArrowRightLeft className="h-7 w-7" /> Stock Transfers
        </h1>
        <p className="text-sm text-slate-500">
          Move inventory between your warehouses and facilities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TRANSFER FORM CARD */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Execute Transfer</CardTitle>
            <CardDescription>Select a product to move stock.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Product</label>
                <Select
                  required
                  value={formData.productId}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      productId: val,
                      quantity: "",
                      targetStoreId: "",
                    })
                  }
                >
                  <SelectTrigger>
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

              {/* Dynamic Info Box: Only shows when a product is selected */}
              {selectedProduct && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Location:</span>
                    <span className="font-medium text-slate-900">
                      {currentStoreName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Available Stock:</span>
                    <Badge variant="secondary">
                      {selectedProduct.stockCount} units
                    </Badge>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Destination Warehouse
                </label>
                <Select
                  required
                  disabled={!formData.productId}
                  value={formData.targetStoreId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, targetStoreId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination..." />
                  </SelectTrigger>
                  <SelectContent>
                    {stores
                      .filter((store) => store._id !== currentStoreId) // Hide the warehouse it is currently in
                      .map((store) => (
                        <SelectItem key={store._id} value={store._id}>
                          {store.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity to Move</label>
                <Input
                  required
                  disabled={!formData.productId}
                  type="number"
                  min="1"
                  max={selectedProduct?.stockCount || 1}
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2"
              >
                <ArrowRightLeft className="mr-2 h-4 w-4" /> Move Stock
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* QUICK REFERENCE STOCK TABLE */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader>
            <CardTitle>Current Stock Directory</CardTitle>
            <CardDescription>
              Live view of all inventory locations.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-slate-500"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    const storeId = product.storeId?._id || product.storeId;
                    const storeName =
                      stores.find((s) => s._id === storeId)?.name ||
                      "Unassigned";

                    return (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-slate-400" />{" "}
                            {product.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />{" "}
                            {storeName}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{product.stockCount}</Badge>
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
