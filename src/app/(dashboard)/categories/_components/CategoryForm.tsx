"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategoryAction, updateCategoryAction } from "../../../../actions/category.actions";
import { FiSave as FiSaveBase, FiArrowLeft as FiArrowLeftBase, FiImage as FiImageBase } from "react-icons/fi";
import { categorySchema } from "@/lib/validations/category.schema";

const FiSave = FiSaveBase as React.ElementType;
const FiArrowLeft = FiArrowLeftBase as React.ElementType;
const FiImage = FiImageBase as React.ElementType;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CategoryForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    image: initialData?.image || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Zod Validation
    const validation = categorySchema.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid category data");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (initialData?._id) {
        await updateCategoryAction(initialData._id, formData, token);
      } else {
        await createCategoryAction(formData, token);
      }
      
      router.push("/categories");
      router.refresh();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the category");
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
          <span>Back to Categories</span>
        </button>
        <button 
          type="submit" 
          disabled={saving}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <FiSave className="w-4 h-4" />
          <span>{saving ? "Saving..." : (initialData ? "Save Category Changes" : "Create New Category")}</span>
        </button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-stone-900">Category Details</h2>
          <p className="text-xs text-stone-400 mt-0.5">Basic category metadata and cover thumbnail</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Category Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Dog Food, Cat Toys"
              className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Image URL</label>
            <div className="relative">
              <FiImage className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/category-image.jpg"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900 font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
