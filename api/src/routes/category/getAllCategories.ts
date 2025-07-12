import express from "express";
import type { Request, Response } from "express";
import type { CategoryError,GetListCategoryResponse } from "../../interface/CategoryData";
import Category from "../../models/Category";

const router = express.Router();

router.get("/all", async ( req: Request, res: Response<CategoryError | GetListCategoryResponse> )=>{
    try{

        const user = (req as any).user;
        const customerId = user.id;
        
        
        const existingCategory = await Category.find({
            customerId: customerId
        })

        console.log(existingCategory)
        
        res.status(200).send()
        return
    }catch(error){
        res.status(500).json({ message: "Erreur serveur" });
        return ;
    }
})

export default router