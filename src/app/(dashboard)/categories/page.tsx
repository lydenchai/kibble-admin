'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchCategoriesAction, deleteCategoryAction } from "@/actions/category.actions";
import { FiPlus as FiPlusBase, FiEdit as FiEditBase, FiTrash2 as FiTrash2Base, FiSearch as FiSearchBase } from "react-icons/fi";
import { Tag, Search } from "lucide-react";
import { CategoryType } from "@/types/category";
import Pagination from "@/components/ui/Pagination";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const FiPlus = FiPlusBase as React.ElementType;
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
      toast.success("Category deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete category", err);
      toast.error(err.message || "Failed to delete category");
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
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-xs font-semibold mb-2 border border-brand-200">
            <Tag className="w-3.5 h-3.5 text-brand-600" />
            <span>Taxonomy & Grouping</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Organize products into pet supplies categories</p>
        </div>
        <Link href="/categories/new">
          <Button variant="primary" size="md" leftIcon={<FiPlus className="w-4 h-4" />}>
            Add Category
          </Button>
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 justify-between bg-white shrink-0">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories by name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-auto scroll-smooth max-h-[calc(100vh-390px)] min-h-[250px]">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">No.</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">Loading categories...</td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <tr key={category._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-400">{(page - 1) * limit + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={category.image} alt="" className="h-10 w-10 rounded-lg object-cover border border-slate-200 bg-slate-50" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                          <Tag className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono font-medium text-slate-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/categories/${category._id}`}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <FiEdit size={16} />
                        </Link>
                        <button
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Category"
                          onClick={() => setDeleteTargetId(category._id)} 
                          disabled={isDeleting === category._id}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-3 text-slate-400">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">No categories found</p>
                      <p className="text-xs text-slate-400 mt-0.5 mb-4">No categories match your search filter.</p>
                      <Link href="/categories/new">
                        <Button variant="primary" size="sm">
                          Create Category
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
