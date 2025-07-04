import express from "express";
import { DepenseSchema } from "../../schema/DepenseSchema";
import type { Request, Response } from "express";
import type { DepenseData, DepenseDataError } from "../../interface/DepenseData";
import Category from "../../models/Category";
import driver from "../../dataBase/neo4j";

const router = express.Router();

router.post("/create", async ( req: Request<DepenseData>, res: Response< null|DepenseDataError> )=>{
    try{

        const user = (req as any).user;
        const customerId = user.id;
    

        const result = DepenseSchema.safeParse(req.body);
        

        if (!result.success) {
            res.status(400).json({message: "Donnée de saisis invalides"});
            return ;
        }
        
        result.data.tags ||= "";

        const { montant,description,date,categoryName,tags } = result.data;
        
        const existingCategory = await Category.findOne({
            categoryName: categoryName,
            customerId: customerId
        })
        
        if(!existingCategory){
            res.status(400).json({message: "La catégorie n'existe pas"})
            return
        }

        const categoryId = existingCategory._id.toString()

        
        
        const session = driver.session();
        
        await session.run(
            `
            MERGE (a:User {id: $customerId})
            MERGE (b:Category {name: $categoryId})
            CREATE (c:Depense {
                montant: $montant,
                description: $description,
                date: $date,
                tags: $tags
                })
                CREATE (a)-[:A_FAIT]->(c)
                CREATE (c)-[:APPARTIENT_A]->(b)
                `,
                { customerId, categoryId, montant, description, date, tags }
            );
            
        await session.close();
        
        
        res.status(200).send()
        return
    }catch(error){
        console.log(error)
        res.status(500).json({ message: "Erreur serveur" });
        return ;
    }
})
export default router