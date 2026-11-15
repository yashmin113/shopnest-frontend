


import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { apiFetch } from "../lib/api.js";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiFetch("/api/products");
        const productList = Array.isArray(data) ? data : data.products || [];

        setProducts(productList.slice(0, 4));
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <div
        className="
          px-5
          py-12
          bg-gradient-to-r
          from-black
          to-amber-950
          text-center
          animate-[fadeIn_0.6s_ease-in-out]
        "
      >
        <h1
          className="
            font-bold
            text-white
            text-3xl
            sm:text-4xl
            md:text-5xl
            tracking-[-0.5px]
            mb-4
          "
        >
          Welcome to ShopNest
        </h1>

        <p
          className="
          text-lg
            text-zinc-300
            text-center
            max-w-3xl
            mx-auto
            leading-7
            mb-6
          "
        >
          Your one-stop destination for all your shopping needs. Explore our
          wide range of quality products, discover great deals, and find
          everything you need—all in one place. Start shopping today and enjoy
          a simple, convenient, and seamless shopping experience.
        </p>

        <Link
          to="/shop"
          className="
            inline-block
            bg-gradient-to-br
            from-orange-500
            to-orange-600
            text-white
            px-6
            py-3
            rounded-lg
            font-semibold
            text-[15px]
            transition-all
            duration-300
            shadow-[0_4px_14px_rgba(234,88,12,0.3)]
            hover:-translate-y-0.5
            hover:shadow-[0_6px_20px_rgba(234,88,12,0.5)]
            hover:brightness-110
            active:translate-y-px
          "
        >
          Start Shopping
        </Link>
      </div>

      {/* Featured Products */}
      <div className="px-5 py-8 max-w-[1400px] mx-auto">
        <h2
          className="
            font-bold
            text-white
            text-3xl
            sm:text-4xl
            md:text-5xl
            tracking-[-0.5px]
            mb-6
            text-left
          "
        >
          Featured Products
        </h2>

        {loading ? (
          <div className="text-white text-center">
            Loading....
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-6
            "
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

