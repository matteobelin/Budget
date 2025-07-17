import express from "express";
import createDepense from "./createDepense"
import getAllDepense from "./getAllDepense"
import updateDepense from "./updateDepense"
import deleteDepense from "./deleteDepense"
import statistic from "./depenseStatistic"

const router = express.Router();

router.use(createDepense)
router.use(getAllDepense)
router.use(updateDepense)
router.use(deleteDepense)
router.use(statistic)

export default router