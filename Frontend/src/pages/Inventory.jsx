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

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          stockCount: Number(formData.stockCount),
          storeId: formData.storeId,
        }),
      });

      if (response.ok) {
        setFormData({
          name: "",
          price: "",
          stockCount: "",
          storeId: "",
        });

        const freshRes = await fetch("http://localhost:5000/api/products");

        if (freshRes.ok) {
          setProducts(await freshRes.json());
        }
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setProducts((currentProducts) =>
          currentProducts.filter((p) => p._id !== productId),
        );
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
          <PackageSearch className="h-7 w-7 text-primary" />
          Inventory
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage your product catalog, stock levels, and storage locations.
        </p>
      </div>

      {/* ADD PRODUCT CARD */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 pb-4">
          <CardTitle className="text-lg text-card-foreground">
            Add Product
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 items-end gap-4 md:grid-cols-4"
          >
            {/* PRODUCT NAME */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Product Name
              </label>

              <Input
                required
                placeholder="Product name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </div>

            {/* PRICE */}
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
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
              />
            </div>

            {/* STOCK */}
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
                  setFormData({
                    ...formData,
                    stockCount: e.target.value,
                  })
                }
              />
            </div>

            {/* LOCATION + SUBMIT */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Location
              </label>

              <div className="flex gap-2">
                <Select
                  required
                  value={formData.storeId}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      storeId: value,
                    })
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

      {/* PRODUCT TABLE */}
      <Card className="overflow-hidden border-border bg-card p-0 shadow-sm">
        <Table>
          {/* Distinct header — no top spacing */}
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
                  Loading inventory...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const storeName =
                  product.storeId?.name ||
                  stores.find((store) => store._id === product.storeId)?.name ||
                  "Unassigned";

                return (
                  <TableRow
                    key={product._id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    {/* PRODUCT */}
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

                    {/* PRICE */}
                    <TableCell className="font-medium text-foreground">
                      $
                      {(product.price || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>

                    {/* STOCK */}
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="border border-border bg-secondary text-secondary-foreground"
                      >
                        {product.stockCount} units
                      </Badge>
                    </TableCell>

                    {/* LOCATION */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{storeName}</span>
                      </div>
                    </TableCell>

                    {/* ACTIONS */}
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
      </Card>
    </div>
  );
}
