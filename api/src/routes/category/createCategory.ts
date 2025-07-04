import express from "express";
import { CreateCategorySchema } from "../../schema/CategorySchema";
import type { Request, Response } from "express";
import type { CategoryData, CategoryError } from "../../interface/CategoryData";
import Category from "../../models/Category";


const router = express.Router();

router.post("/create", async ( req: Request<CategoryData>, res: Response< null|CategoryError> )=>{
    try{

        const user = (req as any).user;
        const customerId = user.id;
        
        const result = CreateCategorySchema.safeParse(req.body);
        
        if (!result.success) {
            res.status(400).json({message: "Donnée de saisis invalides"});
            return ;
        }
        
        const { categoryName,color } = result.data;
        
        const existingCategory = await Category.findOne({
            categoryName: categoryName,
            customerId: customerId
        })
        
        if(existingCategory){
            res.status(409).json({ message: "La catégorie existe deja" });
            return;
        }
        
        const category = new Category({
            categoryName,
            color,
            customerId
        })
    
        await category.save()
        res.status(200).send()
        return
    }catch(error){
        res.status(500).json({ message: "Erreur serveur" });
        return ;
    }
})
export default router