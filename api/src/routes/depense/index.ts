import express from "express";
import createDepense from "./createDepense"
import getAllDepense from "./getAllDepense"

const router = express.Router();

router.use(createDepense)
router.use(getAllDepense)

export default router