"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategoryAction, updateCategoryAction } from "../../../../lib/actions/category.actions";
import { FiSave as FiSaveBase, FiArrowLeft as FiArrowLeftBase, FiImage as FiImageBase } from "react-icons/fi";

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
    setSaving(true);

    try {
      if (initialData?._id) {
        await updateCategoryAction(initialData._id, formData);
      } else {
        await createCategoryAction(formData);
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
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
          <FiArrowLeft className="w-5 h-5" />
          Back to Categories
        </button>
        <button 
          type="submit" 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <FiSave className="w-5 h-5" />
          {saving ? "Saving..." : (initialData ? "Save Changes" : "Create Category")}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Category Details</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
          <input 
            required 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="e.g. Dog Food"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <div className="flex items-center gap-4">
            {formData.image ? (
              <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                <FiImage className="w-6 h-6" />
              </div>
            )}
            <input 
              type="url" 
              name="image" 
              value={formData.image} 
              onChange={handleChange} 
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Provide an absolute URL to the category image.</p>
        </div>
      </div>
    </form>
  );
}
