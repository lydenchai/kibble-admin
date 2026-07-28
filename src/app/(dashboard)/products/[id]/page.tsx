"use client";

import { useEffect, useState, use } from "react";
import { fetchProductByIdAction } from "@/actions/product.actions";
import ProductForm from "@/components/features/products/ProductForm";

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
        if (res.success && res.data) {
          setProduct(res.data);
        } else {
          setError(res.error || "Product not found");
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

  if (loading) return <div className="p-8 max-w-7xl mx-auto text-xs text-stone-400 font-medium">Loading product data...</div>;

  if (error || !product) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-700 text-sm font-bold">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Edit Product</h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">Update product specifications, prices, and variant options</p>
      </div>

      <ProductForm initialData={product} />
    </div>
  );
}
