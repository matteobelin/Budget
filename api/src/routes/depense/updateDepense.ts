import express from "express";
import { EditDepenseSchema } from "../../schema/DepenseSchema";
import type { Request, Response } from "express";
import type { DepenseDataError, DepenseDataWithId } from "../../interface/DepenseData";
import Category from "../../models/Category";
import driver from "../../dataBase/neo4j";
import { client } from "../../dataBase/redis"

const router = express.Router();

router.put("/update", async ( req: Request<DepenseDataWithId>, res: Response< null|DepenseDataError> )=>{
    try{

        const user = (req as any).user;
        const customerId = user.id;

        const result = EditDepenseSchema.safeParse(req.body);
        

        if (!result.success) {
            res.status(400).json({message: "Donnée de saisis invalides"});
            return ;
        }
        
        result.data.tags ||= "";

        const { _id,montant,description,date,categoryName,tags } = result.data;
        let categoryId

        if(categoryName!="Default"){
            const existingCategory = await Category.findOne({
                categoryName: categoryName,
                customerId: customerId
            })
            
            if(!existingCategory){
                res.status(400).json({message: "La catégorie n'existe pas"})
                return
            }
            categoryId = existingCategory._id.toString()
        }else{
            categoryId = "Default"
        }
        
        
        const session = driver.session();
        
        const resultDepense = await session.run(
            `
            MATCH (d:Depense) WHERE id(d) = $_id
            OPTIONAL MATCH (d)-[r:APPARTIENT_A]->()
            DELETE r
            SET d.montant = $montant,
                d.description = $description,
                d.date = $date,
                d.tags = $tags
            MERGE (b:Category {name: $categoryId})
            CREATE (d)-[:APPARTIENT_A]->(b)
            RETURN d
            `,
            { _id: parseInt(_id), montant, description, date, tags, categoryId }
        );

        if (resultDepense.records.length === 0) {
            res.status(404).send({ message: "Dépense non trouvée" })
        }   

        const key = customerId + "depenses"
        const statKey = customerId + "depensesStat";
        
        let requests = await client.get(key);
        let statRequests = await client.get(statKey);
    

        if (requests != null) {
            await client.del(key); 
        }

        if (statRequests != null){
            await client.del(statKey); 
        }
        
        res.status(200).send({ message: "Dépense modifié avec succès" })
        return
    }catch(error){
        console.log(error)
        res.status(500).json({ message: "Erreur serveur" });
        return ;
    }
})
export default router