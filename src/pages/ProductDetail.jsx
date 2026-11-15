

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { useToast } from '../context/ToastContext.jsx';
import WishlistButton from '../components/WishlistButton.jsx';
import { apiFetch } from '../lib/api.js';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiFetch(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          productId: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          qty: 1
        })
      );

      showToast('Successfully added to your cart!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-black p-10 text-center text-orange-500">
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen w-full bg-black p-10 text-center text-red-500">
        Product Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black px-4 py-8 text-white sm:px-8">

      {/* Breadcrumb Navigation */}
      <div className="mx-auto mb-6 w-full max-w-7xl text-sm text-zinc-400">
        <Link to="/" className="text-orange-500 hover:text-orange-400">
          Home
        </Link>
        {' / '}
        <Link to="/shop" className="text-orange-500 hover:text-orange-400">
          Shop
        </Link>
        {' / '}
        {product.category}
        {' / '}
        <span className="text-white">{product.name}</span>
      </div>

      {/* Product Detail Card */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-8 lg:grid-cols-2 lg:gap-12">

        {/* Product Image */}
        <div className="flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-[550px] w-full rounded-xl object-contain shadow-2xl"
          />
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">

          <div className="mb-2 flex items-start justify-between gap-4">
            <h2 className="text-3xl font-bold sm:text-4xl">
              {product.name}
            </h2>

            <WishlistButton
              product={product}
              size="lg"
              className="mt-1 border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
            />
          </div>

          <p className="my-4 text-3xl font-bold text-orange-500 sm:text-4xl">
            ₹{Number(product.price).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>

          {/* Description */}
          <div className="mb-6">
            <h4 className="mb-2 text-lg font-semibold text-white">
              Product Description
            </h4>

            <p className="text-base leading-8 text-zinc-400">
              {product.description}
            </p>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full rounded-lg bg-orange-500 px-5 py-4 text-lg font-semibold text-white transition-colors duration-300 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-600 sm:w-auto"
          >
            {product.stock > 0
              ? 'Add to Shopping Cart'
              : 'Out of Stock'}
          </button>

          {/* Stock Status */}
          <p
            className={`mt-5 font-semibold ${
              product.stock > 0 ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {product.stock > 0
              ? `● In Stock (${product.stock} units available)`
              : '● Temporarily Out of Stock'}
          </p>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
