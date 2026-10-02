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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-xs font-semibold mb-2 border border-brand-200">
            <Package className="w-3.5 h-3.5 text-brand-600" />
            <span>Inventory Management</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Products Catalog</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage pet food, treats, and accessories inventory</p>
        </div>
        <Link href="/products/new">
          <Button variant="primary" size="md" leftIcon={<FiPlus className="w-4 h-4" />}>
            Add Product
          </Button>
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 justify-between bg-white shrink-0">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products by title or brand..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Pet Type Filter Dropdown */}
            <select
              value={pet_typeFilter}
              onChange={(e) => setpet_typeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-brand-500 transition-colors cursor-pointer"
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
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-brand-500 transition-colors cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-auto scroll-smooth max-h-[calc(100vh-390px)] min-h-[250px]">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">No.</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Info</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Inventory</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-slate-400 font-semibold tracking-wider uppercase">Loading catalog...</td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => {
                  const totalStock = product.variants.reduce((acc, v) => acc + ((v.stock as number) || 0), 0);
                  const basePrice = product.variants.length > 0 ? (product.variants[0].price as number) : 0;
                  
                  return (
                    <tr key={product._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-400">{(page - 1) * limit + index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-50"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                              <Package className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{product.name}</div>
                            <div className="text-xs text-slate-500 capitalize">{product.brand} • {product.pet_type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        {totalStock <= 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Out of Stock</span>
                          </span>
                        ) : totalStock <= 5 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Low Stock ({totalStock})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{totalStock} in stock</span>
                          </span>
                        )}
                        <span className="block text-[11px] text-slate-400 font-medium mt-0.5">({product.variants.length} variants)</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-700">
                        {product.category?.name || "Uncategorized"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                        ${basePrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-md border ${
                          product.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-1.5">
                          <Link
                            href={`/products/${product._id}`}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <FiEdit size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleteTargetId(product._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-3 text-slate-400">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">No products found</p>
                      <p className="text-xs text-slate-400 mt-0.5 mb-4">No products match your search and filter criteria.</p>
                      <Link href="/products/new">
                        <Button variant="primary" size="sm">
                          Add New Product
                        </Button>
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
