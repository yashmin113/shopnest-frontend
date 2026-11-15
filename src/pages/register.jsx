import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "../context/ToastContext.jsx";
import { apiFetch } from "../lib/api.js";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: { name, email, password },
      });

      if (data.emailSent === false) {
        showToast(
          "Account created, but the OTP email could not be sent. Use Resend OTP.",
          "info"
        );
      } else {
        showToast(
          "Registration successful. Enter the OTP sent to your email.",
          "success"
        );
      }

      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      showToast(error.message || "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-800 bg-black p-[15px] text-[15px] text-white outline-none transition-all duration-300 ease-in-out placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_2px_rgba(249,115,22,0.2)]";

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center bg-black px-4 py-8 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="relative flex w-full max-w-[420px] flex-col gap-5 overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] before:absolute before:left-[-50%] before:top-0 before:h-1 before:w-[200%] before:animate-[shimmer_3s_linear_infinite] before:bg-[linear-gradient(90deg,transparent,#f97316,transparent)] before:content-[''] sm:p-8 md:p-10"
      >
        <h2 className="mb-2.5 text-center text-3xl text-white sm:text-[2rem]">
          Register
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          className={inputClass}
        />

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
          type="password"
          placeholder="Password (minimum 6 characters)"
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
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-3 text-center text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(234,88,12,0.3)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(234,88,12,0.5)] hover:brightness-110 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-[15px] text-center text-sm text-zinc-400 sm:text-base">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-orange-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
