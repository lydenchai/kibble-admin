"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategoryAction, updateCategoryAction } from "@/actions/category.actions";
import { uploadImageClient } from "@/lib/uploadClient";
import {
  FiSave as FiSaveBase,
  FiArrowLeft as FiArrowLeftBase,
  FiImage as FiImageBase,
  FiUploadCloud as FiUploadCloudBase,
  FiTrash2 as FiTrash2Base,
  FiLoader as FiLoaderBase,
} from "react-icons/fi";
import { categorySchema } from "@/lib/validations/category.schema";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const FiSave = FiSaveBase as React.ElementType;
const FiArrowLeft = FiArrowLeftBase as React.ElementType;
const FiImage = FiImageBase as React.ElementType;
const FiUploadCloud = FiUploadCloudBase as React.ElementType;
const FiTrash2 = FiTrash2Base as React.ElementType;
const FiLoader = FiLoaderBase as React.ElementType;

export default function CategoryForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    image: initialData?.image || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const localUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: localUrl }));

    setUploading(true);
    try {
      const serverUrl = await uploadImageClient(file);
      setFormData((prev) => ({ ...prev, image: serverUrl }));
      toast.success("Category image uploaded successfully!");
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
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
      const token = localStorage.getItem("accessToken");
      if (initialData?._id) {
        await updateCategoryAction(initialData._id, formData, token);
        toast.success("Category updated successfully!");
      } else {
        await createCategoryAction(formData, token);
        toast.success("Category created successfully!");
      }

      router.push("/categories");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save category");
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
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          leftIcon={<FiArrowLeft className="w-4 h-4" />}
        >
          Back to Categories
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={saving}
          leftIcon={<FiSave className="w-4 h-4" />}
        >
          {initialData ? "Save Category Changes" : "Create New Category"}
        </Button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-stone-900">Category Details</h2>
          <p className="text-xs text-stone-400 mt-0.5">Basic category metadata and cover thumbnail</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Category Name *
            </label>
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

          {/* Category Image Upload Dropzone */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Category Image
            </label>

            {formData.image ? (
              <div className="relative group w-44 h-44 rounded-2xl overflow-hidden border border-stone-200 shadow-xs bg-stone-50">
                <img
                  src={formData.image}
                  alt="Category preview"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md transition-transform hover:scale-110 cursor-pointer"
                    title="Remove image"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-stone-300 hover:border-brand-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-stone-50/50 hover:bg-brand-50/20 transition-all text-center group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2 text-brand-600">
                    <FiLoader className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-bold">Uploading Image...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <FiUploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-stone-900">
                      Click to upload category image
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      SVG, PNG, JPG or WebP (max 5MB)
                    </p>
                  </>
                )}
              </label>
            )}

            {/* External URL Fallback */}
            <div className="mt-3">
              <details className="text-xs text-stone-400 cursor-pointer">
                <summary className="hover:text-stone-600 font-medium select-none">
                  Or enter external image URL
                </summary>
                <div className="relative mt-2">
                  <FiImage className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/category-image.jpg"
                    className="w-full pl-10 pr-4 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all text-stone-900"
                  />
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
