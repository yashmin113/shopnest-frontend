

import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, addToCart } from '../redux/cartSlice';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQty = (item, qty) => {
    if (qty > 0) {
      dispatch(addToCart({ ...item, qty }));
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.qty),
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + Number(item.qty),
    0
  );

  return (
    <div className="min-h-screen w-full bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Page Heading */}
        <h2 className="mb-2 text-2xl font-bold sm:text-3xl">
          Shopping Cart
        </h2>

        <p className="mb-8 text-sm text-zinc-400">
          Review your items before checkout.
        </p>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-12 text-center sm:py-16">
            <h3 className="mb-3 text-xl font-semibold sm:text-2xl">
              Your cart is empty
            </h3>

            <p className="mb-6 text-zinc-400">
              You haven't added any products to your cart yet.
            </p>

            <Link
              to="/products"
              className="inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              {cartItems.map((item) => (
                <div
                  key={item.productId || item._id}
                  className="flex min-w-0 flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-orange-500/40 sm:flex-row sm:items-center sm:p-5"
                >
                  {/* Product Image */}
                  <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl border border-zinc-700 bg-white sm:h-32 sm:w-32">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-2 break-words text-lg font-semibold sm:text-xl">
                      {item.name}
                    </h4>

                    <p className="text-lg font-bold text-orange-500">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </p>

                    {/* Quantity Controls */}
                    <div className="my-4 flex items-center gap-4">
                      <button
                        onClick={() =>
                          handleUpdateQty(item, Number(item.qty) - 1)
                        }
                        disabled={Number(item.qty) <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-white transition hover:border-orange-500 hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        -
                      </button>

                      <span className="min-w-6 text-center font-semibold">
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          handleUpdateQty(item, Number(item.qty) + 1)
                        }
                        aria-label={`Increase quantity of ${item.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-white transition hover:border-orange-500 hover:bg-orange-500"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() =>
                        handleRemove(item.productId || item._id)
                      }
                      className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <div className="text-left sm:self-start sm:text-right">
                    <p className="text-sm text-zinc-400">Subtotal</p>

                    <p className="font-semibold text-white">
                      ₹
                      {(
                        Number(item.price) * Number(item.qty)
                      ).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="h-fit rounded-xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 lg:sticky lg:top-24">
              <h3 className="mb-5 border-b border-zinc-800 pb-4 text-xl font-bold sm:text-2xl">
                Order Summary
              </h3>

              <div className="mb-4 flex justify-between gap-3 text-zinc-400">
                <span>Total Items</span>
                <span className="text-white">{totalItems}</span>
              </div>

              <div className="mb-6 flex items-center justify-between gap-3">
                <span className="font-semibold">Total Price</span>

                <span className="text-xl font-bold text-orange-500">
                  ₹
                  {totalPrice.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <Link
                to="/"
                className="mt-4 block text-center text-sm text-zinc-400 transition hover:text-orange-400"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;