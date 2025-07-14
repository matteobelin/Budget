import express from "express";
import type { Request, Response } from "express";
import type { DepenseDataError, GetListDepenseResponse } from "../../interface/DepenseData";
import { client } from "../../dataBase/redis";
import Category from "../../models/Category";
import driver from "../../dataBase/neo4j";

const router = express.Router();

router.get("/all", async ( req: Request, res: Response<DepenseDataError | GetListDepenseResponse> )=>{
    try{

        const user = (req as any).user;
        const customerId = user.id;

        const key = customerId + "depenses"

        let requests = await client.get(key);

        if (requests == null){

            const session = driver.session();
            const result = await session.run(
            `
            MATCH (a:User {id: $customerId})-[:A_FAIT]->(c:Depense)-[:APPARTIENT_A]->(b:Category)
            RETURN c, b.name AS categoryId
            `,
                { customerId }
            );

            const depenses: GetListDepenseResponse = [];

            for (const record of result.records) {
                const c = record.get('c');
                const categoryId = record.get('categoryId');

                const category = await Category.findById(categoryId);

                if (!category){
                    res.status(400).json({message:"Erreur lors du chargements des catégories"})
                    return;
                }

                depenses.push({
                    _id: c.identity.toString(),
                    montant: c.properties.montant,
                    description: c.properties.description,
                    date: c.properties.date,
                    tags: c.properties.tags || "",
                    categoryName: category.categoryName,
                    categoryColor: category.color
                });
            }

            await client.set(key, JSON.stringify(depenses));
            await session.close();
            
            res.status(200).json(depenses);
            return;

        } else {
            const existingDepense = JSON.parse(requests);
            res.status(200).json(existingDepense);
            return;
        }
    }catch(error){
        res.status(500).json({ message: "Erreur serveur" });
        return ;
    }
})

export default router