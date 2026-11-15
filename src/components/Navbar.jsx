

import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { AutheContext } from "../context/AutheContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

const Navbar = () => {
  const { user, logout } = useContext(AutheContext);
  const { wishlistCount } = useWishlist();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[rgba(9,9,11,0.92)] shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      
      <div className="flex w-full flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8 lg:px-[50px]">

        {/* Logo + ShopNest */}
        <NavLink
          to="/"
          className="group flex shrink-0 items-center gap-2.5 no-underline"
        >
          {/* Lucide Logo - NO BOX */}
          <ShoppingCart
            className="h-8 w-8 shrink-0 text-white transition-all duration-300 group-hover:text-red-500 sm:h-9 sm:w-9"
            strokeWidth={2.5}
          />

          {/* Brand Name */}
          <span className="whitespace-nowrap text-[26px] font-extrabold tracking-[-1px] sm:text-[30px] md:text-[32px]">
            <span className="text-white">Shop</span>
            <span className="text-red-500">Nest.</span>
          </span>
        </NavLink>

        {/* Navigation */}
        <ul className="m-0 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 p-0 sm:gap-x-7 md:gap-x-9 lg:gap-x-10">

          {/* Shop */}
          <li>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `relative text-base font-bold no-underline transition-all duration-300 sm:text-lg ${
                  isActive
                    ? "text-white after:w-full"
                    : "text-zinc-300 hover:text-white after:w-0 hover:after:w-full"
                }
                after:absolute after:left-0 after:-bottom-2 after:h-[2px]
                after:rounded-full after:bg-red-500
                after:transition-all after:duration-300`
              }
            >
              Shop
            </NavLink>
          </li>

          {/* Cart */}
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative text-base font-bold no-underline transition-all duration-300 sm:text-lg ${
                  isActive
                    ? "text-white after:w-full"
                    : "text-zinc-300 hover:text-white after:w-0 hover:after:w-full"
                }
                after:absolute after:left-0 after:-bottom-2 after:h-[2px]
                after:rounded-full after:bg-red-500
                after:transition-all after:duration-300`
              }
            >
              Cart ({cartItems.length})
            </NavLink>
          </li>

          {user && (
            <li>
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `relative text-base font-bold no-underline transition-all duration-300 sm:text-lg ${
                    isActive
                      ? "text-white after:w-full"
                      : "text-zinc-300 hover:text-white after:w-0 hover:after:w-full"
                  }
                  after:absolute after:left-0 after:-bottom-2 after:h-[2px]
                  after:rounded-full after:bg-red-500
                  after:transition-all after:duration-300`
                }
              >
                Wishlist ({wishlistCount})
              </NavLink>
            </li>
          )}

          {user ? (
            <>
              {/* Profile */}
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `relative max-w-[150px] truncate text-base font-bold no-underline transition-all duration-300 sm:max-w-none sm:text-lg ${
                      isActive
                        ? "text-white after:w-full"
                        : "text-zinc-300 hover:text-white after:w-0 hover:after:w-full"
                    }
                    after:absolute after:left-0 after:-bottom-2 after:h-[2px]
                    after:rounded-full after:bg-red-500
                    after:transition-all after:duration-300`
                  }
                >
                  Hi, {user.name}
                </NavLink>
              </li>

              {/* Admin */}
              {user.role === "admin" && (
                <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `relative text-base font-bold no-underline transition-all duration-300 sm:text-lg ${
                        isActive
                          ? "text-white after:w-full"
                          : "text-zinc-300 hover:text-white after:w-0 hover:after:w-full"
                      }
                      after:absolute after:left-0 after:-bottom-2 after:h-[2px]
                      after:rounded-full after:bg-red-500
                      after:transition-all after:duration-300`
                    }
                  >
                    Admin
                  </NavLink>
                </li>
              )}

              {/* Logout */}
              <li>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer rounded-md border border-red-500/40 bg-transparent px-4 py-2 text-base font-bold text-red-500 transition-all duration-300 hover:-translate-y-px hover:border-red-500 hover:bg-red-500/10"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            /* Login */
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `relative text-base font-bold no-underline transition-all duration-300 sm:text-lg ${
                    isActive
                      ? "text-white after:w-full"
                      : "text-zinc-300 hover:text-white after:w-0 hover:after:w-full"
                  }
                  after:absolute after:left-0 after:-bottom-2 after:h-[2px]
                  after:rounded-full after:bg-red-500
                  after:transition-all after:duration-300`
                }
              >
                Login
              </NavLink>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
