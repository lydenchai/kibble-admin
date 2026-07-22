"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCategoriesAction } from "../../../../actions/category.actions";
import { FiPlus as FiPlusBase, FiTrash2 as FiTrash2Base, FiSave as FiSaveBase, FiArrowLeft as FiArrowLeftBase } from "react-icons/fi";
import { CategoryType } from "@/types/category";
import { createProductAction, updateProductAction } from "@/actions/product.actions";
 

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
    petType: initialData?.petType || "dog",
    isActive: initialData?.isActive ?? true,
    tags: initialData?.tags?.join(", ") || "",
    ratingAvg: initialData?.ratingAvg || 0,
    ratingCount: initialData?.ratingCount || 0,
    images: initialData?.images || [""],
    variants: initialData?.variants || [
      { sku: "", price: 0, compareAtPrice: 0, stock: 0, size: "", weight: "", flavor: "" }
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
      variants: [...prev.variants, { sku: "", price: 0, compareAtPrice: 0, stock: 0, size: "", weight: "", flavor: "" }]
    }));
  };

  const removeVariant = (index: number) => {
    const newVariants = formData.variants.filter((_: unknown, i: number) => i !== index);
    setFormData(prev => ({ ...prev, variants: newVariants.length ? newVariants : prev.variants }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        ...formData,
        ratingAvg: Number(formData.ratingAvg),
        ratingCount: Number(formData.ratingCount),
        tags: formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        images: formData.images.filter((i: string) => i.trim() !== "")
      };

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
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
          <FiArrowLeft className="w-5 h-5" />
          Back to Products
        </button>
        <button 
          type="submit" 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 cursor-pointer"
        >
          <FiSave className="w-5 h-5" />
          {saving ? "Saving..." : (initialData ? "Save Changes" : "Create Product")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                  <input required type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select required name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating Average (0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" name="ratingAvg" value={formData.ratingAvg} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating Count</label>
                  <input type="number" min="0" name="ratingCount" value={formData.ratingCount} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Variants & Pricing</h2>
              <button type="button" onClick={addVariant} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <FiPlus className="w-4 h-4" /> Add Variant
              </button>
            </div>
            
            <div className="space-y-6">
              {formData.variants.map((variant: { sku: string, price: number, compareAtPrice?: number, stock: number, size?: string, weight?: string, flavor?: string }, index: number) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 relative">
                  {formData.variants.length > 1 && (
                    <button type="button" onClick={() => removeVariant(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">SKU *</label>
                      <input required type="text" value={variant.sku} onChange={(e) => handleVariantChange(index, 'sku', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Price *</label>
                      <input required type="number" min="0" step="0.01" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Compare At</label>
                      <input type="number" min="0" step="0.01" value={variant.compareAtPrice} onChange={(e) => handleVariantChange(index, 'compareAtPrice', Number(e.target.value))} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Stock *</label>
                      <input required type="number" min="0" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-blue-500 focus:outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Size</label>
                      <input type="text" placeholder="e.g. Large" value={variant.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Weight</label>
                      <input type="text" placeholder="e.g. 5kg" value={variant.weight} onChange={(e) => handleVariantChange(index, 'weight', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Flavor</label>
                      <input type="text" placeholder="e.g. Chicken" value={variant.flavor} onChange={(e) => handleVariantChange(index, 'flavor', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-blue-500 focus:outline-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Status & Organization */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Organization</h2>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <span className="font-medium text-gray-700">Product is Active</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Pet Type *</label>
              <select required name="petType" value={formData.petType} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="small-pet">Small Pet</option>
                <option value="fish">Fish</option>
                <option value="reptile">Reptile</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g. sale, premium, grain-free" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              <p className="text-xs text-gray-500 mt-1">Comma separated</p>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Media</h2>
              <button type="button" onClick={addImage} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <FiPlus className="w-4 h-4" /> Add URL
              </button>
            </div>
            <div className="space-y-3">
              {formData.images.map((img: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <input 
                    type="url" 
                    placeholder="https://example.com/image.jpg" 
                    value={img} 
                    onChange={(e) => handleImageChange(index, e.target.value)} 
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" 
                  /> 
                  <button type="button" disabled={formData.images.length === 1} onClick={() => removeImage(index)} className="p-2 text-gray-400 hover:text-red-500 disabled:hover:text-gray-400">
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
