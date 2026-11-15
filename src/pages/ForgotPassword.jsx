import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ShieldQuestion } from "lucide-react";
import { useToast } from "../context/ToastContext.jsx";
import { apiFetch } from "../lib/api.js";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-black p-[15px] text-[15px] text-white outline-none transition-all duration-300 ease-in-out placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_2px_rgba(249,115,22,0.2)]";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: { email },
      });

      showToast(
        "If that email exists, a reset code has been sent. Check your inbox.",
        "success"
      );
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      showToast(
        error.message || "Unable to send a reset code. Please try again.",
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
          <ShieldQuestion className="h-7 w-7 text-orange-500" />
        </div>

        <div className="text-center">
          <h2 className="text-3xl text-white">Forgot Password</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Enter your account email and we will send you a 6-digit code to
            reset your password.
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

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(234,88,12,0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Sending..." : "Send Reset Code"}
        </button>

        <p className="text-center text-sm text-zinc-400">
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-orange-500 hover:underline">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
