import express from "express";
import createCategory from "./createCategory"
import getAllCategory from "./getAllCategories"

const router = express.Router();

router.use(createCategory)
router.use(getAllCategory)

export default router