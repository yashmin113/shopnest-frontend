
import { NavLink } from "react-router-dom";
import WishlistButton from "./WishlistButton.jsx";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-white/5 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50">

      {/* Product Image */}
      <div className="relative">
        <NavLink to={`/product/${product._id}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-60 object-cover transition-transform duration-500 hover:scale-105"
          />
        </NavLink>

        <WishlistButton
          product={product}
          className="absolute right-3 top-3 z-10"
        />
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow justify-between">

        <div>
          {/* Product Name */}
          <NavLink to={`/product/${product._id}`}>
            <h3 className="text-lg font-semibold text-white mb-2 truncate hover:text-orange-500 transition-colors">
              {product.name}
            </h3>
          </NavLink>

          {/* Product Price */}
          <p className="text-[22px] font-bold text-orange-500 mb-4">
            ₹{product.price.toFixed(2)}
          </p>
        </div>

        {/* View Details Button */}
        <NavLink
          to={`/product/${product._id}`}
          className="w-full text-center bg-orange-500 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-600 transition-colors duration-300"
        >
          View Details
        </NavLink>

      </div>
    </div>
  );
};

export default ProductCard;