import { useEffect, useState } from "react";
import { useTheme } from "./components/ui/theme-provider";
import productsData from "./../scaper/zen_products.json";
import { NavBar } from "./components/ui/tubelight-navbar";
import { Home, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  name: string;
  image_url: string;
  new_price: number;
  old_price: number | null;
  colors: string;
  product_link: string;
}

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Done By Yassine", url: "/", icon: User },
];

function App() {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(productsData);
  }, []);

  // Function to calculate the percentage difference
  const calculateDiscountPercentage = (oldPrice: number, newPrice: number) => {
    if (oldPrice && newPrice < oldPrice) {
      return ((oldPrice - newPrice) / oldPrice) * 100;
    }
    return 0;
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <NavBar items={navItems} />
      <div className="container mx-auto pt-24 p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Zen Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.name}
              className={`shadow-lg hover:shadow-xl transition-shadow ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <CardContent className="p-4 flex flex-col items-center">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-48 object-cover rounded-lg mb-3 h-full"
                />
                <h2
                  className={`text-lg font-semibold text-center ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {product.name}
                </h2>
                <div className="flex gap-2 items-center">
                  {product.old_price && (
                    <span className="text-red-500 line-through text-sm">
                      {product.old_price} DT
                    </span>
                  )}
                  {product.old_price && (
                    <span className="text-white text-sm bg-orange-600 rounded-2xl pr-2 pl-2">
                      {calculateDiscountPercentage(
                        product.old_price,
                        product.new_price
                      ).toFixed(1)}
                      % OFF
                    </span>
                  )}
                  <span
                    className={`text-green-500 font-bold text-lg ${
                      theme === "dark" ? "text-green-400" : ""
                    }`}
                  >
                    {product.new_price} DT
                  </span>
                </div>

                <Button
                  variant={theme === "dark" ? "secondary" : "default"}
                  asChild
                >
                  <a
                    href={product.product_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Product
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
