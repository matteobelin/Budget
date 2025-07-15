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
            categoryName: new RegExp(`^${categoryName}$`, 'i'),
            customerId: customerId
        })
        
        if(existingCategory || categoryName == "Default"){
            res.status(409).json({ message: "La catégorie existe deja" });
            return;
        }
        
        const category = new Category({
            categoryName,
            color,
            customerId
        })
    
        await category.save()
        res.status(200).send({ message: "Catégorie créée avec succès" })
        return
    }catch(error){
        res.status(500).json({ message: "Erreur serveur" });
        return ;
    }
})
export default router