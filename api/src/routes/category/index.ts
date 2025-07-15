import express from "express";
import createCategory from "./createCategory"
import getAllCategory from "./getAllCategories"
import updateCategory from "./updateCategory"
import deleteCategory from "./deleteCategory"

const router = express.Router();

router.use(createCategory)
router.use(getAllCategory)
router.use(updateCategory)
router.use(deleteCategory)

export default router