import express from "express";
import createCategory from "./createCategory"

const router = express.Router();

router.use(createCategory)

export default router