import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { AutheContext } from "../context/AutheContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { apiFetch } from "../lib/api.js";

const googleEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-black p-[15px] text-[15px] text-white outline-none transition-all duration-300 ease-in-out placeholder:text-zinc-500 focus:border-orange-500 focus:shadow-[0_0_0_2px_rgba(249,115,22,0.2)]";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login } = useContext(AutheContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const finishLogin = (data) => {
    login(data);
    showToast(`Welcome back, ${data.name}!`, "success");
    navigate(data.role === "admin" ? "/admin" : "/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      finishLogin(data);
    } catch (error) {
      if (error.status === 403 && /verify/i.test(error.message || "")) {
        showToast("Please verify your email first.", "info");
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
        return;
      }

      showToast(error.message || "Unable to sign in. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      showToast("Google sign-in failed. Please try again.", "error");
      return;
    }

    setGoogleLoading(true);

    try {
      const data = await apiFetch("/api/auth/google", {
        method: "POST",
        body: { credential: credentialResponse.credential },
      });

      finishLogin(data);
    } catch (error) {
      showToast(error.message || "Google sign-in failed. Please try again.", "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center bg-black px-4 py-8 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="relative flex w-full max-w-[420px] flex-col gap-5 overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] before:absolute before:left-[-50%] before:top-0 before:h-1 before:w-[200%] before:animate-[shimmer_3s_linear_infinite] before:bg-[linear-gradient(90deg,transparent,#f97316,transparent)] before:content-[''] sm:p-8 md:p-10"
      >
        <h2 className="mb-2.5 text-center text-3xl text-white sm:text-[2rem]">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />

        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputClass}
        />

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-3 text-center text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(234,88,12,0.3)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(234,88,12,0.5)] hover:brightness-110 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Signing in..." : "Login"}
        </button>

        <Link
          to="/forgot-password"
          className="-mt-1 text-center text-xs font-semibold text-zinc-400 transition hover:text-orange-400"
        >
          Forgot your password?
        </Link>

        {googleEnabled && (
          <>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="h-px flex-1 bg-zinc-800" />
              OR
              <span className="h-px flex-1 bg-zinc-800" />
            </div>

            <div className="flex w-full flex-col items-center gap-2">
              {googleLoading ? (
                <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in with Google...
                </span>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    showToast("Google sign-in failed. Please try again.", "error")
                  }
                  theme="filled_black"
                  shape="pill"
                  width="340"
                />
              )}
            </div>
          </>
        )}

        <p className="mt-[15px] text-center text-sm text-zinc-400 sm:text-base">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-orange-500 hover:underline"
          >
            Register
          </Link>
        </p>

        <p className="text-center text-xs text-zinc-500">
          Need to verify your email?{" "}
          <Link
            to="/verify-otp"
            className="font-semibold text-orange-400 hover:underline"
          >
            Enter your OTP
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
