import express from "express";
import Conseil from "./getConseil"

const router = express.Router();

router.use(Conseil)


export default router