import type {GetListCategoryData } from "@/interface/CategoryInterface";

export default interface CategoryContextType {
  categories:GetListCategoryData
  refreshCategories: () => Promise<void>;
}