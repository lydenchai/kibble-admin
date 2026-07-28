"use client";

import { useEffect, useState, use } from "react";
import { fetchCategoryByIdAction } from "@/actions/category.actions";
import CategoryForm from "@/components/features/categories/CategoryForm";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await fetchCategoryByIdAction(resolvedParams.id);
        setCategory(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [resolvedParams.id]);

  if (loading) return <div className="p-8 max-w-7xl mx-auto">Loading category data...</div>;
  
  if (error) return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-gray-500 mt-2">Modify existing category details.</p>
      </div>
      <CategoryForm initialData={category} />
    </div>
  );
}
