import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, Loader2 } from "lucide-react";
import { useToast } from "../context/ToastContext.jsx";
import { apiFetch } from "../lib/api.js";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-black p-[15px] text-[15px] text-white outline-none transition-all duration-300 ease-in-out placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_2px_rgba(249,115,22,0.2)]";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: { email, code, password },
      });

      showToast("Password reset successfully. Please log in.", "success");
      navigate("/login");
    } catch (error) {
      showToast(
        error.message || "Unable to reset your password. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center bg-black px-4 py-8 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[420px] flex-col gap-5 rounded-2xl border border-white/5 bg-zinc-900 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] sm:p-8 md:p-10"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10">
          <KeyRound className="h-7 w-7 text-orange-500" />
        </div>

        <div className="text-center">
          <h2 className="text-3xl text-white">Reset Password</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Enter the 6-digit code from your email and choose a new password.
          </p>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={inputClass}
        />

        <input
          type="text"
          placeholder="6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          required
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          className={`${inputClass} text-center text-2xl tracking-[0.4em]`}
        />

        <input
          type="password"
          placeholder="New password (minimum 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className={inputClass}
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(234,88,12,0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="text-center text-sm text-zinc-400">
          Need a new code?{" "}
          <Link
            to="/forgot-password"
            className="font-semibold text-orange-500 hover:underline"
          >
            Request another
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
