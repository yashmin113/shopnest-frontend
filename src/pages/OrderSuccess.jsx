
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="mx-auto mt-8 max-w-[600px] rounded-2xl border border-white/5 bg-zinc-900 px-6 py-12 text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] sm:px-8 sm:py-14">

        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-4xl text-emerald-500">
            ✓
          </div>
        </div>

        <h2 className="mb-5 text-3xl font-bold text-emerald-500 sm:text-4xl">
          Payment Successful!
        </h2>

        <p className="mb-10 text-base leading-relaxed text-zinc-400 sm:text-xl">
          Thank you for your order. We have securely received your payment and
          will process your shipment shortly.
        </p>

        <Link
          to="/shop"
          className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500/30"
        >
          Continue Shopping
        </Link>

      </div>
    </div>
  );
};

export default OrderSuccess;