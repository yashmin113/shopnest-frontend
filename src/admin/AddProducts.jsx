import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Upload } from "lucide-react";
import { AutheContext } from "../context/AutheContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { PRODUCT_CATEGORIES } from "../constants/categories.js";
import { apiFetch } from "../lib/api.js";

const AddProduct = () => {
  const { user } = useContext(AutheContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      showToast("Please select an image.", "error");
      return;
    }

    if (image.size > 5 * 1024 * 1024) {
      showToast("Image must be 5MB or smaller.", "error");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    data.append("image", image);

    try {
      await apiFetch("/api/admin/products", {
        method: "POST",
        token: user.token,
        body: data,
      });

      showToast("Product created successfully.", "success");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      showToast(
        error.message || "Something went wrong while creating the product.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-[15px] text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl shadow-black/30 sm:p-8 lg:p-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            ShopNest Administration
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Add New Product
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Enter the product details and upload an image to publish it to your
            shop.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-300">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputStyle}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-300">
              Description
            </label>
            <textarea
              placeholder="Describe your product"
              required
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`${inputStyle} resize-y`}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-zinc-300">
                Price (₹)
              </label>
              <input
                type="number"
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={inputStyle}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-zinc-300">
                Stock Quantity
              </label>
              <input
                type="number"
                placeholder="Enter quantity"
                min="0"
                required
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className={inputStyle}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-300">
              Category
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={`${inputStyle} cursor-pointer`}
            >
              <option value="" disabled>
                Select a category
              </option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-dashed border-orange-500/60 bg-orange-500/[0.04] p-5 transition hover:border-orange-400">
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <Upload className="h-4 w-4 text-orange-400" />
              Upload Product Image
            </label>

            <p className="mb-4 text-xs text-zinc-500">
              Select an image file for your product. It will be uploaded to
              Cloudinary through the admin API.
            </p>

            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setImage(e.target.files[0])}
              className="block w-full cursor-pointer text-sm text-zinc-300 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-orange-500 file:px-4 file:py-2.5 file:font-bold file:text-black file:transition hover:file:bg-orange-400"
            />

            {image && (
              <p className="mt-3 break-all text-xs text-emerald-400">
                Selected: {image.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-black transition duration-200 hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Uploading & Creating..." : "Publish Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
