import express from "express";
import type { Request, Response } from "express";
import type { DepenseDataError, GetListDepenseResponse } from "../../interface/DepenseData";
import { client } from "../../dataBase/redis";
import Category from "../../models/Category";
import driver from "../../dataBase/neo4j";

const router = express.Router();

router.get("/all", async (req: Request, res: Response<DepenseDataError | GetListDepenseResponse>) => {
    const user = (req as any).user;
    if (!user || !user.id) {
        res.status(401).json({ message: "Utilisateur non authentifié" });
        return 
    }
    const customerId = user.id;
    const key = `${customerId}depenses`;

    let session;

    try {
        const cached = await client.get(key);

        if (cached) {
            const depenses = JSON.parse(cached) as GetListDepenseResponse;
            res.status(200).json(depenses);
            return 
        }

        session = driver.session();

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

            let categoryName = "Default"
            let categoryColor = "#A9A9A9"; 

            if (categoryId !== "Default") {
                const category = await Category.findById(categoryId );
                if (!category) {
                    res.status(400).json({ message: `Catégorie ${categoryId} non trouvée` });
                    return 
                }
                categoryName = category.categoryName
                categoryColor = category.color;
            }

            depenses.push({
                _id: c.properties.id,
                montant: c.properties.montant,
                description: c.properties.description,
                date: c.properties.date,
                tags: c.properties.tags || "",
                categoryName,
                categoryColor
            });
        }

        await client.set(key, JSON.stringify(depenses));
        res.status(200).json(depenses);
        return 

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
        return
    } finally {
        if (session) await session.close();
    }
});

export default router;
