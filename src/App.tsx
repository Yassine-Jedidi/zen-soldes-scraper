import { useEffect, useState } from "react";
import productsData from "./../scaper/zen_products.json";

interface Product {
  name: string;
  image_url: string;
  new_price: number;
  old_price: number | null;
  colors: string;
  product_link: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(productsData);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 m-4">
      {products.map((product) => (
        <div className=" border rounded-lg ">
          <div>{product.name}</div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-24 h-24"
          />
          <div className="text-red-500">{product.old_price}</div>
          <div className="text-green-500">{product.new_price}</div>
        </div>
      ))}
    </div>
  );
}

export default App;
