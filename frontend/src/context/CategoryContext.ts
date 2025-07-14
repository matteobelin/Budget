import { createContext } from "react"
import type CategoryContextType from "@/interface/CategoryContextType"

const CategoryContext = createContext<CategoryContextType>({
    categories:[],
    refreshCategories: async () => {}
})

export default CategoryContext