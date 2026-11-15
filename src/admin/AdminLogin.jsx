import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { AutheContext } from "../context/AutheContext.jsx";
import { apiFetch } from "../lib/api.js";

const AdminLogin = () => {
  const { user, login } = useContext(AutheContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (data.role !== "admin") {
        throw new Error("This account does not have admin access.");
      }

      login(data);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-[15px] text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10">
            <ShieldCheck className="h-7 w-7 text-orange-500" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">
            ShopNest<span className="text-orange-500">.</span>
          </h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Admin Portal
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl shadow-black/40 sm:p-8"
        >
          <div>
            <h2 className="text-xl font-bold">Sign in to continue</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Admin credentials are required to access the dashboard.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <div className="space-y-2">
            <label
              htmlFor="admin-email"
              className="text-sm font-semibold text-zinc-300"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@shopnest.com"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="admin-password"
              className="text-sm font-semibold text-zinc-300"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-black transition hover:bg-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-xs text-zinc-500">
            Storefront customers should use the{" "}
            <Link to="/login" className="font-semibold text-orange-400 hover:underline">
              customer login
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
