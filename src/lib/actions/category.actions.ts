 
import { CategoryType } from "@/src/app/_types/category";
import { categoryApi } from "../api/category.api";

export const fetchCategoriesAction = async (page?: number, limit?: number) => {
  const res = await categoryApi.getCategories(page, limit);
  if (res.success) {
    return { data: res.data as CategoryType[], total: res.pagination?.total || 0 };
  }
  throw new Error(res.error?.message || "Failed to fetch categories");
};

export const fetchCategoryByIdAction = async (id: string) => {
  const res = await categoryApi.getCategoryById(id);
  if (res.success) {
    return res.data as CategoryType;
  }
  throw new Error(res.error?.message || "Failed to fetch category");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createCategoryAction = async (data: any) => {
  const res = await categoryApi.createCategory(data);
  if (res.success) return res.data;
  throw new Error(res.error?.message || "Failed to create category");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCategoryAction = async (id: string, data: any) => {
  const res = await categoryApi.updateCategory(id, data);
  if (res.success) return res.data;
  throw new Error(res.error?.message || "Failed to update category");
};

export const deleteCategoryAction = async (id: string) => {
  const res = await categoryApi.deleteCategory(id);
  if (res.success) return true;
  throw new Error(res.error?.message || "Failed to delete category");
};
