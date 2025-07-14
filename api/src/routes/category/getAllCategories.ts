import express from "express";
import type { Request, Response } from "express";
import type { CategoryError,GetListCategoryResponse } from "../../interface/CategoryData";
import Category from "../../models/Category";
import { client } from "../../dataBase/redis";

const router = express.Router();

router.get("/all", async ( req: Request, res: Response<CategoryError | GetListCategoryResponse> )=>{
    try{

        const user = (req as any).user;
        const customerId = user.id;

        const key = customerId + "categories"

        let requests = await client.get(key);
        
        let existingCategory;

        if (requests == null) {
            existingCategory = await Category.find({ customerId: customerId });
            if(!existingCategory){
                res.status(401).json({message:"La catégorie n'existe pas"})
                return;
            }
            await client.set(key, JSON.stringify(existingCategory));
        } else {
            existingCategory = JSON.parse(requests);
        }
        
        

        res.status(200).json(existingCategory);
        return
    }catch(error){
        res.status(500).json({ message: "Erreur serveur" });
        return ;
    }
})

export default router