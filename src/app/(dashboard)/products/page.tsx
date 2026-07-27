"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiPlus as FiPlusBase, FiSearch as FiSearchBase, FiEdit, FiTrash } from "react-icons/fi";
import { ProductType } from "../../../types/product";
import { deleteProductAction, fetchProductsAction } from "../../../actions/product.actions";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";

const FiPlus = FiPlusBase as React.ElementType;
const FiSearch = FiSearchBase as React.ElementType;

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [petTypeFilter, setPetTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetchProductsAction(page, limit, undefined, search);
      if (res.success && res.data) {
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
  }, [page, limit, search]);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      setIsDeleting(deleteTargetId);
      await deleteProductAction(deleteTargetId);
      setProducts(products.filter(p => p._id !== deleteTargetId));
    } catch (err) {
      console.error("Failed to delete product", err);
    } finally {
      setIsDeleting(null);
      setDeleteTargetId(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    
    const matchesPetType = petTypeFilter === "all" || p.petType === petTypeFilter;
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? p.isActive : !p.isActive);

    return matchesSearch && matchesPetType && matchesStatus;
  });

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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-medium text-stone-900"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Pet Type Filter Dropdown */}
            <select
              value={petTypeFilter}
              onChange={(e) => setPetTypeFilter(e.target.value)}
              className="px-3.5 py-2.5 border border-stone-200 rounded-xl bg-white text-xs font-bold text-stone-700 focus:outline-none focus:border-stone-400 transition-colors cursor-pointer"
            >
              <option value="all">All Pet Types</option>
              <option value="dog">🐕 Dog</option>
              <option value="cat">🐈 Cat</option>
              <option value="bird">🦜 Bird</option>
              <option value="small-pet">🐹 Small Pet</option>
              <option value="fish">🐠 Fish</option>
            </select>

            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 border border-stone-200 rounded-xl bg-white text-xs font-bold text-stone-700 focus:outline-none focus:border-stone-400 transition-colors cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
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
                      <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-stone-400">{(page - 1) * limit + index + 1}</td>
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
                            onClick={() => setDeleteTargetId(product._id)}
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Product"
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
                      <p className="text-xs text-stone-400 mt-0.5 mb-4">No products match your search and filter criteria.</p>
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product?"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete Product"
        variant="danger"
        isLoading={Boolean(isDeleting)}
      />
    </div>
  );
}
