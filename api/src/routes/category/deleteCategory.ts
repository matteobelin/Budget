import express from "express";
import { EditCategorySchema } from "../../schema/CategorySchema";
import type { Request, Response } from "express";
import type { GetCategoryResponse, CategoryError } from "../../interface/CategoryData";
import Category from "../../models/Category";
import driver from "../../dataBase/neo4j";
import { client } from "../../dataBase/redis"

const router = express.Router();

router.delete("/delete", async ( req: Request<GetCategoryResponse>, res: Response< null|CategoryError> )=>{
    try{

        const user = (req as any).user;
        const customerId = user.id;

        const key = customerId + "depenses"
                
        let requests = await client.get(key);
            
        
        if (requests != null) {
            await client.del(key); 
        }

        
        const result = EditCategorySchema.safeParse(req.body);
        
        if (!result.success) {
            res.status(400).json({ message: "Donnée de saisie invalides" });
            return;
        }

        const { _id } = result.data;


        const existingCategory = await Category.findById(_id);

        if (!existingCategory) {
            res.status(409).json({ message: "La catégorie n'existe pas" });
            return;
        }
        const categoryId = existingCategory._id.toString();


        const session = driver.session();
        try {

            await session.run(
                `
                MATCH (u:User {id: $customerId})-[:A_FAIT]->(d:Depense)-[:APPARTIENT_A]->(c:Category {name: $categoryId})
                MERGE (defaultCat:Category {name: "Default"})
                WITH d, defaultCat, c
                OPTIONAL MATCH (d)-[rel:APPARTIENT_A]->()
                DELETE rel
                CREATE (d)-[:APPARTIENT_A]->(defaultCat)
                WITH c
                DELETE c
                `,
                { categoryId, customerId }
            );
        } finally {
            await session.close();
        }

        await existingCategory.deleteOne();

        res.status(200).json({ message: "Catégorie supprimée" });

    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
})
export default router