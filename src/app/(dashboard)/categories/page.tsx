"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchCategoriesAction, deleteCategoryAction } from "@/actions/category.actions";
import { FiPlus as FiPlusBase, FiTag as FiTagBase, FiEdit as FiEditBase, FiTrash2 as FiTrash2Base, FiSearch as FiSearchBase } from "react-icons/fi";
import { CategoryType } from "@/types/category";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";

const FiPlus = FiPlusBase as React.ElementType;
const FiTag = FiTagBase as React.ElementType;
const FiEdit = FiEditBase as React.ElementType;
const FiTrash2 = FiTrash2Base as React.ElementType;
const FiSearch = FiSearchBase as React.ElementType;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, total: totalRes } = await fetchCategoriesAction(page, limit);
      setCategories(data);
      setTotal(totalRes);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, limit]);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      setIsDeleting(deleteTargetId);
      await deleteCategoryAction(deleteTargetId);
      setCategories(categories.filter(c => c._id !== deleteTargetId));
    } catch (err) {
      console.error("Failed to delete category", err);
    } finally {
      setIsDeleting(null);
      setDeleteTargetId(null);
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Categories</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1">Organize products into pet supplies categories</p>
        </div>
        <Link 
          href="/categories/new"
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-xs"
        >
          <FiPlus className="w-4.5 h-4.5" />
          <span>Add Category</span>
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-stone-200/80 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4.5 border-b border-stone-100 flex flex-col sm:flex-row gap-4 justify-between bg-stone-50/40">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Search categories by name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-medium text-stone-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-100">
            <thead className="bg-stone-50/70">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">No.</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-right text-xs font-black text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-stone-400 font-medium">Loading categories...</td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <tr key={category._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-stone-400">{(page - 1) * limit + index + 1}</td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      {category.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={category.image} alt={category.name} className="h-10 w-10 rounded-xl object-cover border border-stone-200 shadow-xs" />
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 text-sm font-bold">
                          🏷️
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="text-sm font-bold text-stone-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-mono font-semibold text-stone-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/categories/${category._id}`}
                          className="p-2 text-stone-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Category"
                          onClick={() => setDeleteTargetId(category._id)} 
                          disabled={isDeleting === category._id}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mb-3 text-xl">
                        🏷️
                      </div>
                      <p className="text-base font-bold text-stone-900">No categories found</p>
                      <p className="text-xs text-stone-400 mt-0.5 mb-4">No categories match your search filter.</p>
                      <Link href="/categories/new" className="px-4 py-2 bg-brand-50 text-brand-600 text-xs font-bold rounded-xl hover:bg-brand-100 transition-colors">
                        Create Category
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
          itemLabel="categories"
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category?"
        message="Are you sure you want to delete this category? Products associated with this category might break."
        confirmText="Delete Category"
        variant="danger"
        is_loading={Boolean(isDeleting)}
      />
    </div>
  );
}
