import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { AutheContext } from "../../context/AutheContext.jsx";

const getPageTitle = (pathname) => {
  if (pathname === "/admin") return "Dashboard";
  if (pathname === "/admin/products/new") return "Add Product";
  if (pathname.startsWith("/admin/products") && pathname.endsWith("/edit"))
    return "Edit Product";
  if (pathname.startsWith("/admin/products")) return "Products";
  if (pathname.startsWith("/admin/orders")) return "Orders";
  if (pathname.startsWith("/admin/users")) return "Users";
  return "Admin";
};

const AdminTopbar = ({ onMenu }) => {
  const { user, logout } = useContext(AutheContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/10 bg-zinc-950/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="rounded-lg border border-white/10 p-2 text-zinc-300 transition hover:bg-white/5 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-500">
            Administration
          </p>
          <h1 className="truncate text-lg font-extrabold tracking-tight sm:text-xl">
            {getPageTitle(pathname)}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-[180px] truncate text-sm font-semibold">
            {user?.name}
          </p>
          <p className="max-w-[180px] truncate text-xs text-zinc-500">
            {user?.email}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/[0.06] px-4 py-2.5 text-sm font-semibold text-red-400 transition-all duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;
