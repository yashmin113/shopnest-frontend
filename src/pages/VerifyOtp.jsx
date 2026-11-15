import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, MailCheck } from "lucide-react";
import { useToast } from "../context/ToastContext.jsx";
import { apiFetch } from "../lib/api.js";

const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiFetch("/api/auth/verify-otp", {
        method: "POST",
        body: { email, otp },
      });

      showToast("Email verified successfully. You can now log in.", "success");
      navigate("/login");
    } catch (error) {
      showToast(error.message || "Unable to verify OTP.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      showToast("Enter your email first.", "error");
      return;
    }

    setResending(true);

    try {
      await apiFetch("/api/auth/resend-otp", {
        method: "POST",
        body: { email },
      });

      showToast("A new OTP has been sent to your email.", "success");
    } catch (error) {
      showToast(error.message || "Unable to resend OTP.", "error");
    } finally {
      setResending(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-800 bg-black p-[15px] text-[15px] text-white outline-none transition-all duration-300 ease-in-out placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_2px_rgba(249,115,22,0.2)]";

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center bg-black px-4 py-8 sm:px-6">
      <form
        onSubmit={handleVerify}
        className="flex w-full max-w-[420px] flex-col gap-5 rounded-2xl border border-white/5 bg-zinc-900 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] sm:p-8 md:p-10"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10">
          <MailCheck className="h-7 w-7 text-orange-500" />
        </div>

        <div className="text-center">
          <h2 className="text-3xl text-white">Verify Email</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Enter the 6-digit code sent to your email. The code expires in 10
            minutes.
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
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          required
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          className={`${inputClass} text-center text-2xl tracking-[0.4em]`}
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(234,88,12,0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-sm font-semibold text-orange-400 transition hover:text-orange-300 disabled:opacity-60"
        >
          {resending ? "Sending a new code..." : "Resend OTP"}
        </button>

        <p className="text-center text-sm text-zinc-400">
          Already verified?{" "}
          <Link to="/login" className="font-semibold text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default VerifyOtp;
