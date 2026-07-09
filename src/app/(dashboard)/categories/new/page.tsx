"use client";

import CategoryForm from "../_components/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Category</h1>
        <p className="text-gray-500 mt-2">Add a new category to organize your products.</p>
      </div>
      <CategoryForm />
    </div>
  );
}
