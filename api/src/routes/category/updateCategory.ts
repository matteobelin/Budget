import express from "express";
import { EditCategorySchema } from "../../schema/CategorySchema";
import type { Request, Response } from "express";
import type { GetCategoryResponse, CategoryError } from "../../interface/CategoryData";
import Category from "../../models/Category";


const router = express.Router();

router.put("/update", async ( req: Request<GetCategoryResponse>, res: Response< null|CategoryError> )=>{
    try{

        const user = (req as any).user;
        const customerId = user.id;

        
        const result = EditCategorySchema.safeParse(req.body);
        
        if (!result.success) {
            res.status(400).json({ message: "Donnée de saisie invalides" });
            return;
        }

        const { _id, categoryName, color } = result.data;

        if (categoryName === "Default") {
            res.status(409).json({ message: "Le nom 'Default' est réservé" });
            return;
        }

        const existingCategory = await Category.findById(_id);

        if (!existingCategory) {
            res.status(409).json({ message: "La catégorie n'existe pas" });
            return;
        }

        
        const existingCategoryName = await Category.findOne({
            categoryName: new RegExp(`^${categoryName}$`, 'i'),
            customerId,
            _id: { $ne: _id }, 
        });

        if (existingCategoryName) {
            res.status(409).json({ message: "La catégorie existe déjà" });
            return;
        }

        existingCategory.categoryName = categoryName;
        existingCategory.color = color;

        await existingCategory.save();

        res.status(200).send({ message: "Catégorie modifiée avec succès" });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
})
export default router