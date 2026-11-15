import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ClipboardList,
  IndianRupee,
  Package,
  Plus,
  ShoppingBag,
  UserCog,
  Users,
} from "lucide-react";
import { AutheContext } from "../context/AutheContext.jsx";
import { apiFetch } from "../lib/api.js";

const AdminDashboard = () => {
  const { user, logout } = useContext(AutheContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const fetchStats = async () => {
      try {
        setError("");

        const data = await apiFetch("/api/admin/analytics", {
          token: user.token,
        });

        setStats(data);
      } catch (err) {
        if (err.status === 401) {
          logout();
          navigate("/admin/login");
          return;
        }

        console.error("Analytics error:", err);
        setError("Unable to load analytics. Please try again.");
      }
    };

    fetchStats();
  }, [user, navigate, logout]);

  const metrics = [
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      accent: "from-orange-500/20 to-transparent",
      color: "text-orange-400",
      border: "hover:border-orange-500/50",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: Package,
      accent: "from-sky-500/20 to-transparent",
      color: "text-sky-400",
      border: "hover:border-sky-500/50",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      accent: "from-purple-500/20 to-transparent",
      color: "text-purple-400",
      border: "hover:border-purple-500/50",
    },
    {
      title: "Total Revenue",
      value: `₹${Number(stats?.totalRevenue ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: IndianRupee,
      accent: "from-emerald-500/20 to-transparent",
      color: "text-emerald-400",
      border: "hover:border-emerald-500/50",
    },
  ];

  const controls = [
    {
      title: "Add Product",
      description: "Introduce new products to your store.",
      icon: Plus,
      path: "/admin/products/new",
      primary: true,
    },
    {
      title: "Manage Products",
      description: "Edit products and monitor inventory.",
      icon: Package,
      path: "/admin/products",
    },
    {
      title: "Manage Orders",
      description: "Review and manage customer orders.",
      icon: ClipboardList,
      path: "/admin/orders",
    },
    {
      title: "Users Directory",
      description: "View your registered customers.",
      icon: UserCog,
      path: "/admin/users",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-black p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-500/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-px w-2/3 bg-gradient-to-r from-orange-500/70 via-orange-500/20 to-transparent" />

        <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.08] px-3 py-1.5 text-xs font-semibold tracking-wide text-orange-400">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              STORE MANAGEMENT
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Welcome back<span className="text-orange-500">.</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
              Hello,{" "}
              <span className="font-semibold text-white">
                {user?.name || "Admin"}
              </span>
              . Here's your store at a glance. Manage your products, orders and
              customers from one place.
            </p>
          </div>

          <div className="w-fit rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Account status
            </p>
            <p className="mt-2 flex items-center gap-2 font-bold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Admin access
            </p>
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section>
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">
            Business overview
          </p>
          <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            Store Analytics
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            Track your store performance in one place.
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/20 bg-black p-6"
          >
            <p className="font-bold text-red-400">Unable to load analytics</p>
            <p className="mt-2 text-sm text-zinc-400">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 font-bold text-black transition hover:bg-orange-400"
            >
              Try Again
            </button>
          </div>
        ) : !stats ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-black p-8 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-orange-500" />
            <p className="mt-5 font-semibold text-zinc-200">
              Loading analytics...
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Fetching your store statistics
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article
                  key={metric.title}
                  className={`group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-black p-6 transition-all duration-300 ${metric.border} hover:-translate-y-1 hover:shadow-xl hover:shadow-white/[0.03]`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${metric.accent} opacity-60`}
                  />

                  <div className="relative flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-zinc-400">
                      {metric.title}
                    </p>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-black ${metric.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <p className="relative mt-8 break-words text-3xl font-black tracking-tight text-white sm:text-4xl">
                    {metric.value}
                  </p>

                  <p className="relative mt-3 text-xs text-zinc-600">
                    ShopNest store statistics
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">
            Manage your store
          </p>
          <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            Quick Actions
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            Everything you need to run your store efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {controls.map((control) => {
            const Icon = control.icon;

            return (
              <button
                key={control.path}
                type="button"
                onClick={() => navigate(control.path)}
                className={`group flex min-h-44 items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  control.primary
                    ? "border-orange-500/40 bg-orange-500/[0.08] hover:border-orange-500 hover:bg-orange-500/[0.13]"
                    : "border-white/[0.09] bg-black hover:border-orange-500/40 hover:bg-zinc-950"
                }`}
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                    control.primary
                      ? "bg-orange-500 text-black"
                      : "border border-white/[0.08] bg-zinc-950 text-orange-400"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-white">
                    {control.title}
                  </span>

                  <span className="mt-2 block text-sm leading-6 text-zinc-500">
                    {control.description}
                  </span>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-400">
                    Open section
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
