import { useState, useEffect } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stores, setStores] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stockCount: "",
    storeId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, storeResponse] = await Promise.all([
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/stores"),
        ]);
        const productData = await productResponse.json();
        const storeData = await storeResponse.json();

        setProducts(productData);
        setStores(storeData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
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
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          stockCount: Number(formData.stockCount),
          storeId: formData.storeId,
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();

        setProducts([newProduct, ...products]);
        setFormData({ name: "", price: "", stockCount: "", storeId: "" });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (e) {
      console.error("Failed to add product", e);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-200 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            FlowBox Inventory
          </h1>
          <p className="text-neutral-800">Manage your warehouse stock</p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              required
              className="border p-2 rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              required
              className="border p-2 rounded"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Stock Count"
              required
              className="border p-2 rounded"
              value={formData.stockCount}
              onChange={(e) =>
                setFormData({ ...formData, stockCount: e.target.value })
              }
            />
            <select
              required
              className="border p-2 rounded bg-white text-gray-700"
              value={formData.storeId}
              onChange={(e) =>
                setFormData({ ...formData, storeId: e.target.value })
              }
            >
              <option value="" disabled>
                Select a Warehouse
              </option>
              {stores.map((store) => (
                <option key={store._id} value={store._id}>
                  {store.name} ({store.location})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
          >
            Add Product
          </button>
        </form>
        {/* ------------------------ */}

        {isLoading ? (
          <p className="text-gray-500">Loading inventory...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {product.name}
                </h2>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-green-600 font-medium">
                    ${product.price}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                    Stock: {product.stockCount}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mt-4">
                  Location: {product.storeId ? product.storeId.name : "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
