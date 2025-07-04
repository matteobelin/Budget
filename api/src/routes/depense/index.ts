import express from "express";
import createDepense from "./createDepense"

const router = express.Router();

router.use(createDepense)

export default router