"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCategoriesAction } from "@/actions/category.actions";
import { FiPlus as FiPlusBase, FiTrash2 as FiTrash2Base, FiSave as FiSaveBase, FiArrowLeft as FiArrowLeftBase } from "react-icons/fi";
import { CategoryType } from "@/types/category";
import { createProductAction, updateProductAction } from "@/actions/product.actions";
import { productSchema } from "@/lib/validations/product.schema";

const FiPlus = FiPlusBase as React.ElementType;
const FiTrash2 = FiTrash2Base as React.ElementType;
const FiSave = FiSaveBase as React.ElementType;
const FiArrowLeft = FiArrowLeftBase as React.ElementType;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    brand: initialData?.brand || "",
    description: initialData?.description || "",
    category: initialData?.category?._id || initialData?.category || "",
    pet_type: initialData?.pet_type || "dog",
    is_active: initialData?.is_active ?? true,
    tags: initialData?.tags?.join(", ") || "",
    rating_avg: initialData?.rating_avg || 0,
    rating_count: initialData?.rating_count || 0,
    images: initialData?.images || [""],
    variants: initialData?.variants || [
      { sku: "", price: 0, compare_at_price: 0, stock: 0, size: "", weight: "", flavor: "" }
    ],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await fetchCategoriesAction(1, 1000);
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImage = () => setFormData(prev => ({ ...prev, images: [...prev.images, ""] }));
  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_: unknown, i: number) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages.length ? newImages : [""] }));
  };

  const handleVariantChange = (index: number, field: string, value: string | number) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { sku: "", price: 0, compare_at_price: 0, stock: 0, size: "", weight: "", flavor: "" }]
    }));
  };

  const removeVariant = (index: number) => {
    const newVariants = formData.variants.filter((_: unknown, i: number) => i !== index);
    setFormData(prev => ({ ...prev, variants: newVariants.length ? newVariants : prev.variants }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        ...formData,
        rating_avg: Number(formData.rating_avg),
        rating_count: Number(formData.rating_count),
        tags: formData.tags ? formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        images: formData.images.filter((i: string) => i.trim() !== "")
      };

      // Zod Validation
      const validation = productSchema.safeParse(payload);
      if (!validation.success) {
        setError(validation.error.issues[0]?.message || "Invalid product data");
        return;
      }

      setSaving(true);
      const token = localStorage.getItem("accessToken");

      if (initialData?._id) {
        await updateProductAction(initialData._id, payload, token);
      } else {
        await createProductAction(payload, token);
      }
      
      router.push("/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl">
          <p className="text-rose-700 font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Top Action Header */}
      <div className="flex items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>
        <button 
          type="submit" 
          disabled={saving}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <FiSave className="w-4 h-4" />
          <span>{saving ? "Saving..." : (initialData ? "Save Product Changes" : "Create New Product")}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs">
            <h2 className="text-lg font-extrabold text-stone-900 mb-6">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Product Title *</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Organic Salmon Adult Dog Food"
                  className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Brand *</label>
                  <input
                    required
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Royal Canin"
                    className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Category *</label>
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Description *</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Detailed product overview..."
                  className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Rating Avg (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    name="rating_avg"
                    value={formData.rating_avg}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Rating Count</label>
                  <input
                    type="number"
                    min="0"
                    name="rating_count"
                    value={formData.rating_count}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Variants & Pricing */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900">Variants & Pricing</h2>
                <p className="text-xs text-stone-400 mt-0.5">Manage SKUs, stock levels, and size/flavor options</p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <FiPlus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>
            
            <div className="space-y-6">
              {formData.variants.map((variant: { sku: string, price: number, compare_at_price?: number, stock: number, size?: string, weight?: string, flavor?: string }, index: number) => (
                <div key={index} className="p-5 border border-stone-200/80 rounded-2xl bg-stone-50/30 relative">
                  {formData.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="absolute top-4 right-4 text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-stone-500 mb-1">SKU *</label>
                      <input required type="text" value={variant.sku} onChange={(e) => handleVariantChange(index, 'sku', e.target.value)} className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-stone-500 mb-1">Price ($) *</label>
                      <input required type="number" min="0" step="0.01" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))} className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-stone-500 mb-1">Compare At ($)</label>
                      <input type="number" min="0" step="0.01" value={variant.compare_at_price} onChange={(e) => handleVariantChange(index, 'compare_at_price', Number(e.target.value))} className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-stone-500 mb-1">Stock *</label>
                      <input required type="number" min="0" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))} className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-stone-500 mb-1">Size</label>
                      <input type="text" placeholder="e.g. Large" value={variant.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-stone-500 mb-1">Weight</label>
                      <input type="text" placeholder="e.g. 5kg" value={variant.weight} onChange={(e) => handleVariantChange(index, 'weight', e.target.value)} className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-stone-500 mb-1">Flavor</label>
                      <input type="text" placeholder="e.g. Chicken" value={variant.flavor} onChange={(e) => handleVariantChange(index, 'flavor', e.target.value)} className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Organization Settings */}
        <div className="space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-extrabold text-stone-900">Organization & Visibility</h2>
            
            <label className="flex items-center space-x-3 cursor-pointer p-3 bg-stone-50/50 rounded-xl border border-stone-200/60">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 rounded border-stone-300 focus:ring-brand-500"
              />
              <span className="font-bold text-xs text-stone-800">Product is Active & Visible</span>
            </label>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Pet Type Target *</label>
              <select
                name="pet_type"
                value={formData.pet_type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium cursor-pointer"
              >
                <option value="dog">🐕 Dog</option>
                <option value="cat">🐈 Cat</option>
                <option value="bird">🦜 Bird</option>
                <option value="small-pet">🐹 Small Pet</option>
                <option value="fish">🐠 Fish</option>
                <option value="reptile">🦎 Reptile</option>
                <option value="other">🐾 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Product Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="organic, dry-food, puppy"
                className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
              />
              <p className="text-[11px] text-stone-400 mt-1">Separate tags with commas</p>
            </div>
          </div>

          {/* Media Images */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-stone-900">Product Images</h2>
              <button
                type="button"
                onClick={addImage}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <FiPlus className="w-3.5 h-3.5" /> Add Image URL
              </button>
            </div>

            <div className="space-y-3">
              {formData.images.map((img: string, idx: number) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="text-stone-400 hover:text-rose-600 transition-colors p-2 cursor-pointer"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
