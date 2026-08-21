'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiPlus as FiPlusBase, FiSearch as FiSearchBase, FiEdit, FiTrash } from "react-icons/fi";
import { Package, Search, AlertTriangle, CheckCircle2, XCircle, Tag } from "lucide-react";
import { ProductType } from "@/types/product";
import { deleteProductAction, fetchProductsAction } from "@/actions/product.actions";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

const FiPlus = FiPlusBase as React.ElementType;
const FiSearch = FiSearchBase as React.ElementType;

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pet_typeFilter, setpet_typeFilter] = useState("all");
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
      const token = localStorage.getItem('accessToken');
      await deleteProductAction(deleteTargetId, token);
      setProducts(products.filter(p => p._id !== deleteTargetId));
      toast.success("Product deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete product", err);
      toast.error(err?.message || "Failed to delete product. Please ensure you are logged in as Admin or Staff.");
    } finally {
      setIsDeleting(null);
      setDeleteTargetId(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(search.toLowerCase());
    
    const matchespet_type = pet_typeFilter === "all" || p.pet_type === pet_typeFilter;
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? p.is_active : !p.is_active);

    return matchesSearch && matchespet_type && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill bg-brand-50 text-brand-700 text-xs font-extrabold mb-2 border border-brand-100 shadow-xs">
            <Package className="w-3.5 h-3.5 text-brand-600" />
            <span>Inventory Management</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Products Catalog</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1 font-medium">Manage pet food, treats, and accessories inventory</p>
        </div>
        <Link href="/products/new">
          <Button variant="primary" size="md" className="glass-btn-primary rounded-2xl shadow-md font-extrabold text-xs uppercase tracking-wider" leftIcon={<FiPlus className="w-4 h-4" />}>
            Add Product
          </Button>
        </Link>
      </div>

      {/* Table Container */}
      <div className="glass-panel bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/90 overflow-hidden flex flex-col relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
        <div className="p-5 border-b border-stone-100/80 flex flex-col sm:flex-row gap-4 justify-between bg-stone-50/30 shrink-0">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products by title or brand..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 glass-input rounded-2xl text-xs font-bold text-stone-900 placeholder:text-stone-400 placeholder:font-normal"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Pet Type Filter Dropdown */}
            <select
              value={pet_typeFilter}
              onChange={(e) => setpet_typeFilter(e.target.value)}
              className="px-4 py-2.5 glass-pill bg-white/80 border border-stone-200/80 rounded-2xl text-xs font-extrabold text-stone-700 focus:outline-none focus:border-brand-500 transition-all cursor-pointer shadow-xs"
            >
              <option value="all">All Pet Types</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="small-pet">Small Pet</option>
              <option value="fish">Fish</option>
            </select>

            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 glass-pill bg-white/80 border border-stone-200/80 rounded-2xl text-xs font-extrabold text-stone-700 focus:outline-none focus:border-brand-500 transition-all cursor-pointer shadow-xs"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-auto scroll-smooth max-h-[calc(100vh-390px)] min-h-[250px]">
          <table className="min-w-full divide-y divide-stone-100">
            <thead className="bg-stone-50/80 backdrop-blur-md sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-400 uppercase tracking-widest">No.</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Product Info</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Inventory</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Base Price</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-xs font-black text-stone-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/40 divide-y divide-stone-100/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-stone-400 font-bold tracking-wider uppercase">Loading catalog...</td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => {
                  const totalStock = product.variants.reduce((acc, v) => acc + ((v.stock as number) || 0), 0);
                  const basePrice = product.variants.length > 0 ? (product.variants[0].price as number) : 0;
                  
                  return (
                    <tr key={product._id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-6 py-4.5 whitespace-nowrap text-xs font-extrabold text-stone-400">{(page - 1) * limit + index + 1}</td>
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3.5">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-11 h-11 rounded-2xl object-cover border border-white/90 shadow-xs shrink-0 bg-stone-50"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-stone-100 to-amber-50 border border-stone-200/80 flex items-center justify-center text-stone-400 shrink-0 shadow-2xs">
                              <Package className="w-5 h-5 text-stone-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-black text-stone-900 tracking-tight">{product.name}</div>
                            <div className="text-xs text-stone-500 font-extrabold capitalize">{product.brand} • {product.pet_type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-stone-800">
                        {totalStock <= 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black glass-pill bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Out of Stock</span>
                          </span>
                        ) : totalStock <= 5 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black glass-pill bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Low Stock ({totalStock})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black glass-pill bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{totalStock} in stock</span>
                          </span>
                        )}
                        <span className="block text-[11px] text-stone-400 font-bold mt-1">({product.variants.length} variants)</span>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-xs font-extrabold text-stone-700">
                        {product.category?.name || "Uncategorized"}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-sm font-black text-stone-900">
                        ${basePrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs font-black rounded-full glass-pill ${
                          product.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/products/${product._id}`}
                            className="p-2 text-stone-400 hover:text-brand-600 glass-pill bg-white/80 hover:bg-brand-50 rounded-xl transition-all cursor-pointer border border-stone-200/60 shadow-xs"
                            title="Edit Product"
                          >
                            <FiEdit size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleteTargetId(product._id)}
                            className="p-2 text-stone-400 hover:text-rose-600 glass-pill bg-white/80 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-stone-200/60 shadow-xs"
                            title="Delete Product"
                            disabled={isDeleting === product._id}
                          >
                            <FiTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-14 h-14 glass-panel bg-stone-50 rounded-3xl flex items-center justify-center mb-3 text-stone-400 border border-stone-200/80 shadow-xs">
                        <Search className="w-6 h-6 text-stone-400" />
                      </div>
                      <p className="text-base font-black text-stone-900">No products found</p>
                      <p className="text-xs text-stone-400 mt-0.5 mb-5 font-medium">No products match your search and filter criteria.</p>
                      <Link href="/products/new" className="px-5 py-2.5 glass-btn-primary text-white text-xs font-black rounded-2xl shadow-md uppercase tracking-wider">
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
        is_loading={Boolean(isDeleting)}
      />
    </div>
  );
}
