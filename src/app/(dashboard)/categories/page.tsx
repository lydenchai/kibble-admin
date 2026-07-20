"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchCategoriesAction, deleteCategoryAction } from "../../../actions/category.actions";
import { FiPlus as FiPlusBase, FiTag as FiTagBase, FiEdit as FiEditBase, FiTrash2 as FiTrash2Base } from "react-icons/fi";
import { CategoryType } from "../../_types/category";

const FiPlus = FiPlusBase as React.ElementType;
const FiTag = FiTagBase as React.ElementType;
const FiEdit = FiEditBase as React.ElementType;
const FiTrash2 = FiTrash2Base as React.ElementType;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, [page, limit]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Products using this category might break!")) return;
    
    try {
      setIsDeleting(id);
      const token = localStorage.getItem('accessToken');
      await deleteCategoryAction(id, token);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      console.error("Failed to delete category", err);
      alert("Failed to delete category");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <Link 
          href="/categories/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Add Category
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading categories...</td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(page - 1) * limit + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="h-10 w-10 rounded-md object-cover border border-gray-200" />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <FiTag className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <Link
                            href={`/categories/${category._id}`}
                            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                            title="Edit Product"
                          >
                            <FiEdit size={18} />
                          </Link>
                          <button
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            title="Delete Product"
                            onClick={() => handleDelete(category._id)} 
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
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FiTag className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium text-gray-900">No categories found</p>
                      <p className="text-sm text-gray-500 mt-1 mb-4">Get started by creating a new category.</p>
                      <Link href="/categories/new" className="text-blue-600 font-medium hover:underline">
                        + Create Category
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {total > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, total)}</span> of <span className="font-medium">{total}</span> results
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => p + 1)} 
                disabled={page * limit >= total}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
