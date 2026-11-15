import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AutheContext } from "../context/AutheContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { apiFetch } from "../lib/api.js";

const PAGE_SIZE = 10;

const AdminProducts = () => {
  const { user } = useContext(AutheContext);
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        if (query) {
          params.set("search", query);
        }

        const data = await apiFetch(`/api/admin/products?${params}`, {
          token: user.token,
        });

        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : data.products || []);
          setTotal(data.total ?? 0);
          setPages(data.pages ?? 1);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [user?.token, reloadKey, page, query]);

  const refreshProducts = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const nextQuery = searchInput.trim();

    if (nextQuery === query && page === 1) {
      refreshProducts();
      return;
    }

    setLoading(true);
    setPage(1);
    setQuery(nextQuery);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;

    try {
      await apiFetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        token: user.token,
      });

      showToast("Product deleted successfully.", "success");

      if (products.length === 1 && page > 1) {
        setLoading(true);
        setPage((current) => current - 1);
      } else {
        refreshProducts();
      }
    } catch (err) {
      showToast(
        err.message || "Something went wrong while deleting the product.",
        "error"
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            Inventory
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Manage Products
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Manage your store inventory, prices, and product details.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-orange-500 px-5 py-3 font-bold text-black transition hover:bg-orange-400 sm:self-auto"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </Link>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products by name, description or category..."
            className="w-full rounded-xl border border-white/10 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-zinc-900"
        >
          Search
        </button>

        {query && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setQuery("");
              setPage(1);
              setLoading(true);
            }}
            className="rounded-xl px-4 py-3 text-sm font-semibold text-zinc-400 transition hover:text-white"
          >
            Clear
          </button>
        )}
      </form>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={refreshProducts}
            className="font-bold underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[750px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-zinc-950">
              {["ID", "Name", "Price", "Category", "Stock", "Actions"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-zinc-400">
                  Loading products...
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-white/[0.07] transition-colors last:border-b-0 hover:bg-zinc-950"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-sm text-zinc-500">
                    {product._id.substring(0, 8)}...
                  </td>

                  <td className="px-5 py-4 font-semibold text-zinc-200">
                    {product.name}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-orange-400">
                    ₹{Number(product.price).toFixed(2)}
                  </td>

                  <td className="px-5 py-4 text-sm text-zinc-400">
                    {product.category}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                        product.stock > 0
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-red-500/20 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm font-semibold text-sky-400 transition hover:border-sky-500 hover:bg-sky-500 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}

            {!loading && products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm text-zinc-500"
                >
                  {query ? "No products match your search." : "No products found."}
                  <div className="mt-2 text-xs text-zinc-600">
                    Add a product to see it listed here.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-zinc-500">
          Showing{" "}
          <span className="font-bold text-white">
            {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, total)}
          </span>{" "}
          of <span className="font-bold text-white">{total}</span> products
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setPage((current) => Math.max(1, current - 1));
            }}
            disabled={page <= 1 || loading}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 font-semibold transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <span className="px-2 text-zinc-400">
            Page {page} of {pages}
          </span>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setPage((current) => Math.min(pages, current + 1));
            }}
            disabled={page >= pages || loading}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 font-semibold transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
