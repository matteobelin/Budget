import express from "express";
import type { Request, Response } from "express";
import type { CategoryError,GetListCategoryResponse } from "../../interface/CategoryData";

const router = express.Router();

router.get("all", async ( req: Request, res: Response<CategoryError | GetListCategoryResponse> )=>{
    

})