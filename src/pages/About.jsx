import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ShoppingCart,
  LayoutDashboard,
  CreditCard,
  Code2,
  Database,
  Server,
  Lock,
  GitBranch,
  Link2,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description:
      "JWT sessions, bcrypt password hashing, email OTP verification, Google Sign-In, and password reset flows.",
  },
  {
    icon: CreditCard,
    title: "Verified Payments",
    description:
      "Razorpay checkout with server-side HMAC signature verification and totals recalculated from database prices.",
  },
  {
    icon: ShoppingCart,
    title: "Full Storefront",
    description:
      "Product browsing and search, cart, wishlist, checkout with address validation, and order history.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboard",
    description:
      "Role-protected analytics, product CRUD with Cloudinary uploads, order management, and user directory.",
  },
  {
    icon: Lock,
    title: "Hardened Backend",
    description:
      "Zod validation, Helmet headers, CORS allowlist, rate limiting, atomic stock updates, and centralized errors.",
  },
  {
    icon: Database,
    title: "Concurrency-Safe Data",
    description:
      "Conditional, atomic stock reservation prevents overselling during simultaneous checkouts.",
  },
];

const techStack = [
  { icon: Code2, label: "React 19" },
  { icon: Server, label: "Express 5" },
  { icon: Database, label: "MongoDB" },
  { icon: ShieldCheck, label: "JWT Auth" },
  { icon: CreditCard, label: "Razorpay" },
  { icon: Lock, label: "Zod Validation" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="px-5 py-16 bg-gradient-to-b from-amber-950 via-black to-black text-center">
        <p className="text-orange-500 text-sm font-semibold tracking-[0.2em] uppercase mb-3">
          Full-Stack MERN Project
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
          About <span className="text-orange-500">ShopNest</span>
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
          A production-minded e-commerce platform built to demonstrate
          real-world full-stack engineering — secure authentication, verified
          payments, concurrency-safe inventory, and a role-protected admin
          dashboard.
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {techStack.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-sm text-zinc-300"
            >
              <Icon size={16} className="text-orange-500" />
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          What&apos;s under the hood
        </h2>
        <p className="text-zinc-500 text-center mb-10 max-w-xl mx-auto">
          Every feature was built the way it would be in production, not as a
          toy CRUD demo.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl bg-zinc-900 border border-white/5 hover:border-orange-500/50 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors duration-300">
                <Icon size={22} className="text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Project + CTA */}
      <section className="px-5 py-16 bg-gradient-to-b from-black to-amber-950/40">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Try it yourself
          </h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Browse the storefront, add products to your cart, and check out
            with the Razorpay test flow — or register an account to see the
            OTP verification in action.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 font-semibold text-white no-underline shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:shadow-[0_4px_28px_rgba(249,115,22,0.6)] transition-shadow duration-300"
          >
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Developer */}
      <section className="px-5 py-16 max-w-3xl mx-auto">
        <div className="p-8 rounded-2xl bg-zinc-900 border border-white/5 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-2xl font-bold mb-4 shadow-[0_4px_20px_rgba(249,115,22,0.4)]">
            Y
          </div>
          <h2 className="text-xl font-bold mb-1">Yashmin</h2>
          <p className="text-zinc-500 text-sm mb-6">
            Full-Stack Developer — designed and built ShopNest end to end
          </p>
          <div className="flex justify-center gap-3">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800 border border-white/10 text-sm no-underline text-white hover:border-orange-500/50 transition-colors duration-300"
            >
              <GitBranch size={16} />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/yashmin-praveen-5b8ab1225"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/40 text-sm no-underline text-blue-400 hover:border-blue-500 transition-colors duration-300"
            >
              <Link2 size={16} />
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
