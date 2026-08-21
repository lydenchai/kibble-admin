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
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill bg-brand-50 text-brand-700 text-xs font-extrabold mb-2 border border-brand-100 shadow-xs">
            <Tag className="w-3.5 h-3.5 text-brand-600" />
            <span>Taxonomy & Grouping</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">Categories</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1 font-medium">Organize products into pet supplies categories</p>
        </div>
        <Link href="/categories/new">
          <Button variant="primary" size="md" className="glass-btn-primary rounded-2xl shadow-md font-extrabold text-xs uppercase tracking-wider" leftIcon={<FiPlus className="w-4 h-4" />}>
            Add Category
          </Button>
        </Link>
      </div>

      {/* Table Container */}
      <div className="glass-panel bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/90 overflow-hidden flex flex-col relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />
        {/* Search Bar */}
        <div className="p-5 border-b border-stone-100/80 flex flex-col sm:flex-row gap-4 justify-between bg-stone-50/30 shrink-0">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories by name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 glass-input rounded-2xl text-xs font-bold text-stone-900 placeholder:text-stone-400 placeholder:font-normal"
            />
          </div>
        </div>

        <div className="overflow-auto scroll-smooth max-h-[calc(100vh-390px)] min-h-[250px]">
          <table className="min-w-full divide-y divide-stone-100">
            <thead className="bg-stone-50/80 backdrop-blur-md sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-400 uppercase tracking-widest">No.</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Image</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Category Name</th>
                <th className="px-6 py-4 text-left text-xs font-black text-stone-400 uppercase tracking-widest">Slug</th>
                <th className="px-6 py-4 text-right text-xs font-black text-stone-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/40 divide-y divide-stone-100/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs text-stone-400 font-bold uppercase tracking-wider">Loading categories...</td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <tr key={category._id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-6 py-4.5 whitespace-nowrap text-xs font-extrabold text-stone-400">{(page - 1) * limit + index + 1}</td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      {category.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={category.image} alt="" className="h-11 w-11 rounded-2xl object-cover border border-white/90 shadow-xs bg-stone-50" />
                      ) : (
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-stone-100 to-amber-50 border border-stone-200/80 flex items-center justify-center text-stone-400 shrink-0 shadow-2xs">
                          <Tag className="w-5 h-5 text-stone-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="text-sm font-black text-stone-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-xs font-mono font-extrabold text-stone-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/categories/${category._id}`}
                          className="p-2 text-stone-400 hover:text-brand-600 glass-pill bg-white/80 hover:bg-brand-50 rounded-xl transition-all cursor-pointer border border-stone-200/60 shadow-xs"
                          title="Edit Category"
                        >
                          <FiEdit size={16} />
                        </Link>
                        <button
                          className="p-2 text-stone-400 hover:text-rose-600 glass-pill bg-white/80 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-stone-200/60 shadow-xs"
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
                  <td colSpan={5} className="px-6 py-16 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-14 h-14 glass-panel bg-stone-50 rounded-3xl flex items-center justify-center mb-3 text-stone-400 border border-stone-200/80 shadow-xs">
                        <Search className="w-6 h-6 text-stone-400" />
                      </div>
                      <p className="text-base font-black text-stone-900">No categories found</p>
                      <p className="text-xs text-stone-400 mt-0.5 mb-5 font-medium">No categories match your search filter.</p>
                      <Link href="/categories/new" className="px-5 py-2.5 glass-btn-primary text-white text-xs font-black rounded-2xl shadow-md uppercase tracking-wider">
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
