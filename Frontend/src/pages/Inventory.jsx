import React, { useState, useEffect } from "react";
import { PackageSearch, Plus, Trash2, MapPin, Package } from "lucide-react";

// Shadcn Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stockCount: "",
    storeId: "",
  });

  useEffect(() => {
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
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          stockCount: Number(formData.stockCount),
          storeId: formData.storeId,
        }),
      });

      if (response.ok) {
        setFormData({ name: "", price: "", stockCount: "", storeId: "" });
        const freshRes = await fetch("http://localhost:5000/api/products");
        setProducts(await freshRes.json());
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setProducts(products.filter((p) => p._id !== productId));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
          <PackageSearch className="h-7 w-7" /> Inventory
        </h1>
        <p className="text-sm text-slate-500">
          Manage catalog and stock levels.
        </p>
      </div>

      {/* ADD PRODUCT CARD */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <Input
                required
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Stock Count</label>
              <Input
                required
                type="number"
                placeholder="0"
                value={formData.stockCount}
                onChange={(e) =>
                  setFormData({ ...formData, stockCount: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <div className="flex gap-2">
                {/* Shadcn Select requires onValueChange instead of onChange */}
                <Select
                  required
                  value={formData.storeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, storeId: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select..." />
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
                  className="shrink-0 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* PRODUCT TABLE CARD */}
      <Card className="overflow-hidden p-2">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[300px]">Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Location</TableHead>
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
                  Loading inventory...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-slate-500"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const storeName =
                  product.storeId?.name ||
                  stores.find((s) => s._id === product.storeId)?.name ||
                  "Unassigned";
                return (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-slate-400" />{" "}
                        {product.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      ${(product.price || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {product.stockCount} units
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />{" "}
                        {storeName}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product._id)}
                        className="text-slate-400 hover:text-slate-900"
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
      </Card>
    </div>
  );
}
