import { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AutheContext } from "../context/AutheContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { clearCart } from "../redux/cartSlice";
import { apiFetch } from "../lib/api.js";

const Checkout = () => {
  const { user } = useContext(AutheContext);
  const { showToast } = useToast();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [processing, setProcessing] = useState(false);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.qty),
    0
  );

  const orderItems = cartItems.map((item) => ({
    product: item.productId || item._id,
    qty: Number(item.qty),
  }));

  const saveOrder = async (paymentResponse) => {
    try {
      await apiFetch("/api/orders", {
        method: "POST",
        token: user.token,
        body: {
          items: orderItems,
          address,
          payment: {
            orderId: paymentResponse.razorpay_order_id,
            paymentId: paymentResponse.razorpay_payment_id,
            signature: paymentResponse.razorpay_signature,
          },
        },
      });
    } catch (error) {
      throw new Error(
        error.message ||
          "Payment succeeded, but saving the order failed. Please contact support.",
        { cause: error }
      );
    }

    dispatch(clearCart());
    showToast("Order placed successfully!", "success");
    navigate("/ordersuccess");
  };

  const handlePayment = async () => {
    if (!user) {
      showToast("Please login first.", "error");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      showToast("Your cart is empty.", "error");
      navigate("/cart");
      return;
    }

    if (!window.Razorpay) {
      showToast("Razorpay checkout script is not loaded.", "error");
      return;
    }

    if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
      showToast("Razorpay key is not configured.", "error");
      return;
    }

    const orderData = await apiFetch("/api/payment/order", {
      method: "POST",
      token: user.token,
      body: { items: orderItems },
    });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "ShopNest",
      description: "ShopNest order payment",
      order_id: orderData.id,

      handler: async function (response) {
        try {
          setProcessing(true);
          await saveOrder(response);
        } catch (error) {
          showToast(
            error.message || "Something went wrong while confirming your order.",
            "error"
          );
        } finally {
          setProcessing(false);
        }
      },

      prefill: {
        name: address.fullName,
        email: user?.email || "",
      },

      theme: {
        color: "#f97316",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", (response) => {
      showToast(
        response.error?.description || "Payment failed. Please try again.",
        "error"
      );
    });

    razorpay.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setProcessing(true);

    try {
      await handlePayment();
    } catch (error) {
      showToast(
        error.message || "Unable to initialize payment. Please try again.",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  const inputClass =
    "w-full min-w-0 rounded-xl border border-zinc-800 bg-black px-5 py-4 text-base text-white outline-none transition duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 text-center sm:mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            ShopNest Store
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            Enter your shipping details to complete your order.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)] lg:gap-8">
          <section className="min-w-0 rounded-2xl border border-white/5 bg-zinc-950 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.4)] sm:p-8 lg:p-10">
            <h2 className="mb-7 text-xl font-bold sm:text-2xl">
              Shipping Address
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="sr-only">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  autoComplete="name"
                  required
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress({ ...address, fullName: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="street" className="sr-only">
                  Street
                </label>
                <input
                  id="street"
                  type="text"
                  placeholder="Street"
                  autoComplete="street-address"
                  required
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className="sr-only">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="City"
                    autoComplete="address-level2"
                    required
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="sr-only">
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    inputMode="numeric"
                    placeholder="Postal Code"
                    autoComplete="postal-code"
                    required
                    value={address.postalCode}
                    onChange={(e) =>
                      setAddress({ ...address, postalCode: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="sr-only">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  placeholder="Country"
                  autoComplete="country-name"
                  required
                  value={address.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div className="mt-8 border-t border-zinc-800 pt-6 lg:hidden">
                <h3 className="mb-4 text-lg font-bold">Order Summary</h3>

                <div className="flex items-center justify-between gap-4 text-sm text-zinc-400">
                  <span>Items ({cartItems.length})</span>
                  <span>
                    {cartItems.reduce((sum, item) => sum + Number(item.qty), 0)}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="font-semibold">Total to Pay</span>
                  <span className="text-2xl font-extrabold text-orange-500">
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing || cartItems.length === 0}
                className="mt-6 w-full rounded-xl bg-orange-500 px-6 py-4 font-bold text-white shadow-lg shadow-orange-500/10 transition duration-300 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing ? "Processing..." : "Pay Now"}
              </button>

              <p className="text-center text-xs leading-relaxed text-zinc-500">
                Your order will be processed after the payment is confirmed.
              </p>
            </form>
          </section>

          <aside className="hidden rounded-2xl border border-white/5 bg-zinc-950 p-6 shadow-lg lg:sticky lg:top-8 lg:block">
            <h2 className="mb-6 text-xl font-bold">Order Summary</h2>

            <div className="flex justify-between gap-4 border-b border-zinc-800 pb-4 text-sm text-zinc-400">
              <span>Products</span>
              <span>{cartItems.length} types</span>
            </div>

            <div className="flex justify-between gap-4 border-b border-zinc-800 py-4 text-sm text-zinc-400">
              <span>Total quantity</span>
              <span>
                {cartItems.reduce((sum, item) => sum + Number(item.qty), 0)}
              </span>
            </div>

            <div className="flex justify-between gap-4 py-5">
              <span className="font-semibold">Total to Pay</span>
              <span className="text-xl font-extrabold text-orange-500">
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-zinc-500">
              Review your total before placing your order.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
