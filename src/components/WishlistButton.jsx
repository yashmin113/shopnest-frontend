import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { AutheContext } from "../context/AutheContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

const WishlistButton = ({ product, size = "md", className = "" }) => {
  const { user } = useContext(AutheContext);
  const { showToast } = useToast();
  const { isWishlisted, isUpdating, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const active = isWishlisted(product._id);
  const updating = isUpdating(product._id);

  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      showToast("Please log in to save products to your wishlist.", "info");
      navigate("/login");
      return;
    }

    await toggleWishlist(product);
  };

  const dimensions =
    size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const iconDimensions =
    size === "lg" ? "h-6 w-6" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={updating}
      aria-label={
        active
          ? `Remove ${product.name} from wishlist`
          : `Add ${product.name} to wishlist`
      }
      aria-pressed={active}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex ${dimensions} shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-red-500/60 disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      <Heart
        className={`${iconDimensions} transition-all duration-300 ${
          active
            ? "fill-red-500 text-red-500 scale-110"
            : "fill-transparent text-white"
        } ${updating ? "animate-pulse" : ""}`}
        strokeWidth={2.5}
      />
    </button>
  );
};

export default WishlistButton;
