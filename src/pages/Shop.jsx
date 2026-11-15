

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { PRODUCT_CATEGORIES } from '../constants/categories.js';
import { apiFetch } from '../lib/api.js';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiFetch('/api/products');

        // Supports either an array or { products: [...] }
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Unable to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const present = [
      ...new Set(products.map((product) => product.category).filter(Boolean))
    ];
    const ordered = PRODUCT_CATEGORIES.filter((category) =>
      present.includes(category)
    );
    const extras = present
      .filter((category) => !PRODUCT_CATEGORIES.includes(category))
      .sort();

    if (
      selectedCategory !== 'All' &&
      ![...ordered, ...extras].includes(selectedCategory)
    ) {
      return [selectedCategory, ...ordered, ...extras];
    }

    return [...ordered, ...extras];
  }, [products, selectedCategory]);

  const categoryCounts = useMemo(
    () =>
      products.reduce((counts, product) => {
        if (product.category) {
          counts[product.category] = (counts[product.category] || 0) + 1;
        }
        return counts;
      }, {}),
    [products]
  );

  const setSelectedCategory = (category) => {
    const nextParams = new URLSearchParams(searchParams);

    if (category === 'All') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', category);
    }

    setSearchParams(nextParams, { replace: true });
  };

  const trimmedSearch = search.toLowerCase().trim();

  const filteredProducts = products.filter((product) => {
    const matchesSearch = (product.name || '')
      .toLowerCase()
      .includes(trimmedSearch);
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const hasActiveFilters = Boolean(trimmedSearch) || selectedCategory !== 'All';

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">

        {/* Hero Banner */}
        <section className="relative mb-10 overflow-hidden rounded-2xl border border-white/5 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.2),transparent_60%),linear-gradient(135deg,#18181b_0%,#09090b_100%)] px-5 py-16 text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] sm:px-10 sm:py-20 lg:py-24">
          <div className="relative z-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Discover your favorites
            </p>

            <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Explore Our Collection
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              Find the products you love, all in one place.
              Discover quality, style, and great value with ShopNest.
            </p>
          </div>
        </section>

        {/* Shop Heading & Search */}
        <section>
          <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-orange-500">
                ShopNest Store
              </p>

              <h2 className="text-2xl font-bold sm:text-3xl">
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                {loading
                  ? 'Finding products...'
                  : `${filteredProducts.length} products found`}
              </p>
            </div>

            <div className="w-full sm:max-w-sm">
              <label
                htmlFor="product-search"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Search products
              </label>

              <input
                id="product-search"
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-3.5 text-base text-white outline-none transition duration-300 placeholder:text-zinc-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              />
            </div>
          </div>

          {/* Category Filter */}
          {!loading && !error && products.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                aria-pressed={selectedCategory === 'All'}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
                  selectedCategory === 'All'
                    ? 'border-orange-500 bg-orange-500 text-black'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-orange-500/50 hover:text-white'
                }`}
              >
                All ({products.length})
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={selectedCategory === category}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
                    selectedCategory === category
                      ? 'border-orange-500 bg-orange-500 text-black'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-orange-500/50 hover:text-white'
                  }`}
                >
                  {category} ({categoryCounts[category] || 0})
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex min-h-64 items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-orange-500" />
                <p className="text-zinc-400">Loading products...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-300"
            >
              {error}
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="min-w-0 overflow-hidden rounded-xl border border-white/5 bg-zinc-900 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out hover:-translate-y-2 hover:border-orange-500/30 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Empty / No Results */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-16 text-center">
              <h3 className="mb-3 text-xl font-semibold text-white">
                {hasActiveFilters
                  ? 'No products found'
                  : 'No products available yet'}
              </h3>

              <p className="mb-6 text-zinc-400">
                {hasActiveFilters
                  ? `We couldn't find any products${
                      selectedCategory !== 'All'
                        ? ` in "${selectedCategory}"`
                        : ''
                    }${trimmedSearch ? ` matching "${search}"` : ''}.`
                  : 'Please check back later for new arrivals.'}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('All');
                  }}
                  className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500/30"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Shop;
