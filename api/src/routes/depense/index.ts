import express from "express";
import createDepense from "./createDepense"
import getAllDepense from "./getAllDepense"
import updateDepense from "./updateDepense"
import deleteDepense from "./deleteDepense"

const router = express.Router();

router.use(createDepense)
router.use(getAllDepense)
router.use(updateDepense)
router.use(deleteDepense)

export default router