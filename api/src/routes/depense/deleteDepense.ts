import express from "express";
import { EditDepenseSchema } from "../../schema/DepenseSchema";
import type { Request, Response } from "express";
import type { DepenseDataError, DepenseDataWithId } from "../../interface/DepenseData";
import Category from "../../models/Category";
import driver from "../../dataBase/neo4j";
import { client } from "../../dataBase/redis"

const router = express.Router();

router.delete("/delete", async ( req: Request<DepenseDataWithId>, res: Response< null|DepenseDataError> )=>{
    try{

        const user = (req as any).user;
        const customerId = user.id;    

        const result = EditDepenseSchema.safeParse(req.body);
        

        if (!result.success) {
            res.status(400).json({message: "Donnée de saisis invalides"});
            return ;
        }
        
        result.data.tags ||= "";

        const { _id } = result.data;
        
        const session = driver.session();
        
        await session.run(
            `
            MATCH (d:Depense) WHERE id(d) = $_id
            DETACH DELETE d
            `,
            { _id: parseInt(_id) }
        );
        
        const key = customerId + "depenses"
        
        let requests = await client.get(key);
    

        if (requests != null) {
            await client.del(key); 
        }
        
        res.status(200).send({ message: "Dépense supprimée avec succès" })
        return
    }catch(error){
        console.log(error)
        res.status(500).json({ message: "Erreur serveur" });
        return ;
    }
})
export default router