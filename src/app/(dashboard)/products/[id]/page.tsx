"use client";

import { useEffect, useState, use } from "react";
import { fetchProductByIdAction } from "../../../../actions/product.actions";
import ProductForm from "../_components/ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetchProductByIdAction(resolvedParams.id, token);
        if (res.success || res._id) { // Handle both wrapper or direct return
          setProduct(res.data || res);
        } else {
          setError("Product not found");
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id]);

  if (loading) return <div className="p-8 max-w-7xl mx-auto">Loading product data...</div>;
  
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 mt-2">Modify existing product details.</p>
      </div>
      <ProductForm initialData={product} />
    </div>
  );
}
