import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Upload } from "lucide-react";
import { AutheContext } from "../context/AutheContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { getCategoryOptions } from "../constants/categories.js";
import { apiFetch } from "../lib/api.js";

const EditProduct = () => {
  const { id } = useParams();
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
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setFetching(true);
      setError("");

      try {
        const data = await apiFetch(`/api/admin/products/${id}`, {
          token: user.token,
        });

        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          stock: data.stock,
        });
      } catch (err) {
        setError(err.message || "Unable to load product.");
      } finally {
        setFetching(false);
      }
    };

    if (user?.token) fetchProduct();
  }, [id, user?.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (image && image.size > 5 * 1024 * 1024) {
      showToast("Image must be 5MB or smaller.", "error");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("stock", formData.stock);

      if (image) {
        data.append("image", image);
      }

      await apiFetch(`/api/admin/products/${id}`, {
        method: "PUT",
        token: user.token,
        body: data,
      });

      showToast("Product updated successfully.", "success");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      showToast(error.message || "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-3 text-[15px] text-white placeholder-zinc-500 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500";

  if (fetching) {
    return (
      <div className="mx-auto flex min-h-64 w-full max-w-[600px] items-center justify-center rounded-xl border border-white/5 bg-zinc-900 p-5 text-zinc-400 sm:p-10">
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[600px] rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[600px] rounded-xl border border-white/5 bg-zinc-900 p-5 sm:p-10">
      <h2 className="mb-5 text-2xl font-bold text-orange-500">
        Edit Product
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[15px]">
        <input
          type="text"
          placeholder="Product Name"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className={inputStyle}
        />

        <textarea
          placeholder="Description"
          required
          rows="4"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className={`${inputStyle} resize-y`}
        />

        <input
          type="number"
          placeholder="Price"
          required
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          className={inputStyle}
        />

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
          {getCategoryOptions(formData.category).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Stock"
          required
          min="0"
          value={formData.stock}
          onChange={(e) =>
            setFormData({ ...formData, stock: e.target.value })
          }
          className={inputStyle}
        />

        <div className="rounded-lg border border-dashed border-orange-500 p-[15px]">
          <label className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-400">
            <Upload className="h-4 w-4 text-orange-400" />
            Replace Image (Optional)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0] || null)}
            className="w-full cursor-pointer text-sm text-white file:mr-4 file:rounded-md file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-orange-600"
          />

          {image && (
            <p className="mt-2 text-sm text-zinc-400">Selected: {image.name}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
