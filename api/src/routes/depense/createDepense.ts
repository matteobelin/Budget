import express from "express";
import { DepenseSchema } from "../../schema/DepenseSchema";
import type { Request, Response } from "express";
import type { DepenseData, DepenseDataError } from "../../interface/DepenseData";
import Category from "../../models/Category";
import driver from "../../dataBase/neo4j";
import { client } from "../../dataBase/redis";
import { userInfoCollection } from "../../dataBase/chromaDB";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post("/create", async (req: Request<DepenseData>, res: Response<null | DepenseDataError>) => {
    const session = driver.session();

    try {
        const user = (req as any).user;
        if (!user || !user.id) {
            res.status(401).json({ message: "Utilisateur non authentifié" });
            return ;
        }

        const customerId = user.id;

        const result = DepenseSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: "Données de saisie invalides"});
            return ;
        }

        const { montant, description, date, categoryName } = result.data;
        const tags = result.data.tags || "";

        let categoryId;

        if (categoryName !== "Default") {
            const existingCategory = await Category.findOne({
                categoryName: categoryName,
                customerId: customerId
            });

            if (!existingCategory) {
                res.status(400).json({ message: "La catégorie spécifiée n'existe pas" });
                return;
            }

            categoryId = existingCategory._id.toString();
        } else {
            categoryId = "Default";
        }

        const newUuid = uuidv4();

        const resultNeo4j = await session.run(
            `
            MERGE (a:User {id: $customerId})
            MERGE (b:Category {name: $categoryId})
            CREATE (c:Depense {
                id: $uuid,
                montant: $montant,
                description: $description,
                date: $date,
                tags: $tags
            })
            CREATE (a)-[:A_FAIT]->(c)
            CREATE (c)-[:APPARTIENT_A]->(b)
            RETURN c.id as depenseId
            `,
            { customerId, categoryId, montant, description, date, tags,uuid: newUuid }
        );

        if (resultNeo4j.records.length === 0) {
            res.status(500).json({ message: "Erreur lors de la création de la dépense dans Neo4j" });
            return ;
        }

        const chromaId = resultNeo4j.records[0].get("depenseId");

        await userInfoCollection.add({
            ids: [chromaId],
            documents: [
                `Dépense : ${description} ${montant}€ le ${date} - catégorie : ${categoryName}`
            ],
            metadatas: [{
                user_id: customerId,
                depense_id: chromaId,
                categorie: categoryName,
                type: 'depense'
            }]
        });

        // Nettoyage du cache Redis
        const key = `${customerId}depenses`;
        const statKey = `${customerId}depensesStat`;

        await Promise.all([
            client.del(key),
            client.del(statKey)
        ]);

        res.status(200).json({ message: "Dépense créée avec succès"});

    } catch (error: any) {
        console.error("Erreur lors de la création de la dépense :", error);
        res.status(500).json({ message: "Erreur serveur" });
    } finally {
        await session.close();
    }
});

export default router;
