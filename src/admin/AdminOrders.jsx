import { useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { AutheContext } from "../context/AutheContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { apiFetch } from "../lib/api.js";

const PAGE_SIZE = 10;

const statuses = [
  { value: "pending", label: "Pending" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const formatStatus = (status) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending";

const AdminOrders = () => {
  const { user } = useContext(AutheContext);
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        if (statusFilter) {
          params.set("status", statusFilter);
        }

        const data = await apiFetch(`/api/admin/orders?${params}`, {
          token: user.token,
        });

        if (!cancelled) {
          setOrders(Array.isArray(data) ? data : data.orders || []);
          setTotal(data.total ?? 0);
          setPages(data.pages ?? 1);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load orders.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [user?.token, reloadKey, page, statusFilter]);

  const refreshOrders = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const updateStatus = async (id, status) => {
    if (!user?.token || updatingId) return;

    const previousOrder = orders.find((order) => order._id === id);
    if (!previousOrder || previousOrder.status === status) return;

    setUpdatingId(id);
    setError("");

    try {
      await apiFetch(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        token: user.token,
        body: { status },
      });

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );

      showToast("Order status updated successfully.", "success");
    } catch (err) {
      showToast(err.message || "Unable to update order status.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
      case "shipped":
        return "border-sky-500/30 bg-sky-500/10 text-sky-400";
      case "cancelled":
        return "border-red-500/30 bg-red-500/10 text-red-400";
      default:
        return "border-orange-500/30 bg-orange-500/10 text-orange-400";
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            Fulfilment
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Manage Orders
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            View customer orders and update their delivery status.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            aria-label="Filter orders by status"
            value={statusFilter}
            onChange={(e) => {
              setLoading(true);
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="rounded-lg border border-white/10 bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white outline-none focus:border-orange-500"
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={refreshOrders}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-zinc-900 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading..." : "Refresh Orders"}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={refreshOrders}
            className="font-bold underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-zinc-950">
              {["Order ID", "User", "Total", "Date", "Status"].map(
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
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-sm text-zinc-400"
                >
                  Loading orders...
                </td>
              </tr>
            ) : !error && orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  <p className="font-semibold text-zinc-200">No orders found</p>
                  <p className="mt-2 text-sm text-zinc-500">
                    {statusFilter
                      ? "Try a different status filter."
                      : "Orders will appear here after customers place them."}
                  </p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-white/[0.07] transition-colors last:border-b-0 hover:bg-zinc-950"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-sm text-zinc-500">
                    {String(order._id || "").slice(0, 8)}...
                  </td>

                  <td className="px-5 py-4 font-medium text-zinc-200">
                    {order.user?.name || "Deleted User"}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-orange-400">
                    ₹{Number(order.totalAmount ?? 0).toFixed(2)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-400">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN")
                      : "—"}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-col items-start gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyle(
                          order.status
                        )}`}
                      >
                        {formatStatus(order.status)}
                      </span>

                      <select
                        aria-label={`Update status for order ${order._id}`}
                        value={order.status || "pending"}
                        disabled={
                          updatingId !== null || order.status === "cancelled"
                        }
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {statuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>

                      {updatingId === order._id && (
                        <span className="text-xs text-zinc-400">
                          Updating...
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-zinc-400">
          Total orders: <span className="font-bold text-white">{total}</span>
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

export default AdminOrders;
