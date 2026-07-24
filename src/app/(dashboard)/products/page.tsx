"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiPlus as FiPlusBase, FiSearch as FiSearchBase, FiFilter as FiFilterBase, FiBox as FiBoxBase, FiEdit, FiTrash } from "react-icons/fi";
import { ProductType } from "../../../types/product";
import { deleteProductAction, fetchProductsAction } from "../../../actions/product.actions";
import Pagination from "@/components/ui/Pagination";

const FiPlus = FiPlusBase as React.ElementType;
const FiSearch = FiSearchBase as React.ElementType;
const FiFilter = FiFilterBase as React.ElementType;
const FiBox = FiBoxBase as React.ElementType;

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetchProductsAction(page, limit, token);
      if (res.success) {
        setProducts(res.data);
        setTotal(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      setIsDeleting(id);
      const token = localStorage.getItem("accessToken");
      await deleteProductAction(id, token);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Products Catalog</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1">Manage pet food, treats, and accessories inventory</p>
        </div>
        <Link 
          href="/products/new"
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-xs"
        >
          <FiPlus className="w-4.5 h-4.5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 overflow-hidden">
        <div className="p-4.5 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between bg-stone-50/40">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Search products by title or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-medium text-stone-900"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 text-sm font-bold text-stone-700 transition-colors cursor-pointer">
            <FiFilter className="w-4 h-4 text-stone-400" />
            <span>Filters</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-100">
            <thead className="bg-stone-50/70">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">No.</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Product Info</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Inventory</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-black text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-stone-400 font-medium">Loading catalog...</td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => {
                  const totalStock = product.variants.reduce((acc, v) => acc + ((v.stock as number) || 0), 0);
                  const basePrice = product.variants.length > 0 ? (product.variants[0].price as number) : 0;
                  
                  return (
                    <tr key={product._id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-stone-400">{index + 1}</td>
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 font-bold text-base shrink-0">
                            🐾
                          </div>
                          <div>
                            <div className="text-sm font-bold text-stone-900">{product.name}</div>
                            <div className="text-xs text-stone-500 font-semibold">{product.brand} • {product.petType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-stone-800">
                        {totalStock} in stock
                        <span className="block text-xs text-stone-400 font-medium">({product.variants.length} variants)</span>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-sm font-semibold text-stone-700">
                        {product.category?.name || "Uncategorized"}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-sm font-black text-stone-900">
                        ${basePrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs font-black rounded-full ${
                          product.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/products/${product._id}`}
                            className="p-2 text-stone-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <FiEdit size={18} />
                          </Link>
                          <button
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Product"
                            onClick={() => handleDelete(product._id)} 
                            disabled={isDeleting === product._id}
                          >
                            <FiTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-3 text-xl">
                        🔍
                      </div>
                      <p className="text-base font-bold text-stone-900">No products found</p>
                      <p className="text-xs text-stone-400 mt-0.5 mb-4">Get started by adding a new item to your store catalog.</p>
                      <Link href="/products/new" className="px-4 py-2 bg-brand-50 text-brand-600 text-xs font-bold rounded-xl hover:bg-brand-100 transition-colors">
                        Add New Product
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination */}
        <Pagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
          itemLabel="products"
        />
      </div>
    </div>
  );
}
