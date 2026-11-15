import { useContext, useEffect, useState } from "react";
import { AutheContext } from "../context/AutheContext.jsx";
import { apiFetch } from "../lib/api.js";

const AdminUsers = () => {
  const { user } = useContext(AutheContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadUsers = async () => {
      try {
        const data = await apiFetch("/api/admin/users", {
          token: user.token,
        });

        if (!cancelled) {
          setUsers(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load users.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, [user?.token]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            Customers
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            User Directory
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            View registered users and their account details.
          </p>
        </div>

        <div className="w-fit rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3">
          <p className="text-xs font-medium text-zinc-400">Total Users</p>
          <p className="mt-1 text-2xl font-bold text-orange-400">
            {users.length}
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-zinc-950">
              {["ID", "Name", "Email", "Role", "Joined"].map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-sm text-zinc-400"
                >
                  Loading users...
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-white/[0.07] transition-colors duration-200 last:border-b-0 hover:bg-zinc-950"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-sm text-zinc-500">
                    {u._id.substring(0, 8)}...
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-zinc-200">
                    {u.name}
                  </td>

                  <td className="px-5 py-4 text-sm text-zinc-400">{u.email}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                        u.role === "admin"
                          ? "border-orange-500/20 bg-orange-500/10 text-orange-400"
                          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-400">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                </tr>
              ))
            )}

            {!loading && users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-sm text-zinc-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-zinc-600">
        User information is displayed for administrative purposes.
      </p>
    </div>
  );
};

export default AdminUsers;
