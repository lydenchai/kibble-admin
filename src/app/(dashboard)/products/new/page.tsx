"use client";

import ProductForm from "@/components/features/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
        <p className="text-gray-500 mt-2">Add a new product to your catalog.</p>
      </div>
      <ProductForm />
    </div>
  );
}
