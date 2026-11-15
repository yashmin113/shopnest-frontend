/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AutheContext } from "./AutheContext.jsx";
import { useToast } from "./ToastContext.jsx";
import { apiFetch } from "../lib/api.js";

const WishlistContext = createContext(null);

export const useWishlist = () => useContext(WishlistContext);

const requestWishlist = async (token) => {
  const data = await apiFetch("/api/wishlist", { token });
  return Array.isArray(data) ? data : [];
};

const emptyProducts = [];

export const WishlistProvider = ({ children }) => {
  const { user, logout } = useContext(AutheContext);
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loadedUserId, setLoadedUserId] = useState(null);
  const [pendingIds, setPendingIds] = useState(() => new Set());

  const visibleProducts = user ? products : emptyProducts;
  const loading = Boolean(user?.token) && loadedUserId !== user?._id;

  const wishlistIds = useMemo(
    () =>
      new Set(visibleProducts.map((product) => String(product._id))),
    [visibleProducts]
  );

  const isWishlisted = useCallback(
    (productId) => wishlistIds.has(String(productId)),
    [wishlistIds]
  );

  const isUpdating = useCallback(
    (productId) => pendingIds.has(String(productId)),
    [pendingIds]
  );

  useEffect(() => {
    if (!user?.token) {
      return undefined;
    }

    let cancelled = false;

    requestWishlist(user.token)
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
        }
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        if (error.status === 401) {
          logout();
        }

        console.error("Error fetching wishlist:", error);
        showToast(error.message, "error");
      })
      .finally(() => {
        if (!cancelled) {
          setLoadedUserId(user._id);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [logout, showToast, user]);

  const toggleWishlist = useCallback(
    async (product) => {
      if (!user?.token) {
        showToast("Please log in to save products to your wishlist.", "info");
        return false;
      }

      const productId = String(product._id);

      if (pendingIds.has(productId)) {
        return isWishlisted(productId);
      }

      const currentlyWishlisted = isWishlisted(productId);

      setPendingIds((current) => {
        const next = new Set(current);
        next.add(productId);
        return next;
      });

      setProducts((current) => {
        if (currentlyWishlisted) {
          return current.filter(
            (item) => String(item._id) !== productId
          );
        }

        return current.some((item) => String(item._id) === productId)
          ? current
          : [product, ...current];
      });

      try {
        await apiFetch(`/api/wishlist/${productId}`, {
          method: currentlyWishlisted ? "DELETE" : "POST",
          token: user.token,
        });

        showToast(
          currentlyWishlisted
            ? "Removed from your wishlist."
            : "Added to your wishlist.",
          "success"
        );

        return !currentlyWishlisted;
      } catch (error) {
        if (error.status === 401) {
          logout();
          error.message = "Your session expired. Please log in again.";
        }

        setProducts((current) => {
          if (currentlyWishlisted) {
            return current.some((item) => String(item._id) === productId)
              ? current
              : [product, ...current];
          }

          return current.filter((item) => String(item._id) !== productId);
        });

        showToast(error.message, "error");
        return currentlyWishlisted;
      } finally {
        setPendingIds((current) => {
          const next = new Set(current);
          next.delete(productId);
          return next;
        });
      }
    },
    [
      isWishlisted,
      logout,
      pendingIds,
      showToast,
      user,
    ]
  );

  const value = useMemo(
    () => ({
      products: visibleProducts,
      wishlistCount: visibleProducts.length,
      loading,
      isWishlisted,
      isUpdating,
      toggleWishlist,
    }),
    [
      isUpdating,
      isWishlisted,
      loading,
      toggleWishlist,
      visibleProducts,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
