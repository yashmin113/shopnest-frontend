import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { AutheContext } from "../context/AutheContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

const Wishlist = () => {
  const { user } = useContext(AutheContext);
  const { products, loading, wishlistCount } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 border-b border-zinc-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <Heart className="h-6 w-6 fill-current" />
              </span>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                My Wishlist
              </h1>
            </div>

            <p className="text-sm text-zinc-400 sm:text-base">
              {wishlistCount === 0
                ? "Save the products you love and find them here later."
                : `${wishlistCount} ${
                    wishlistCount === 1 ? "product" : "products"
                  } saved for later.`}
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex w-fit items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-orange-500 hover:bg-zinc-800"
          >
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-red-500" />
              <p className="text-zinc-400">Loading your wishlist...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-16 text-center sm:py-20">
            <Heart className="mx-auto mb-5 h-12 w-12 text-zinc-600" />

            <h2 className="mb-3 text-2xl font-semibold">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mb-7 max-w-md text-zinc-400">
              Tap the heart on any product to save it here for later.
            </p>

            <Link
              to="/shop"
              className="inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
