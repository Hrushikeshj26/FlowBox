import { useState, useEffect } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();

        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            FlowBox Inventory
          </h1>
          <p className="text-gray-500">Manage your warehouse stock</p>
        </header>

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
