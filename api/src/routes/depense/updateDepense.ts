import express from "express";
import { EditDepenseSchema } from "../../schema/DepenseSchema";
import type { Request, Response } from "express";
import type { DepenseDataError, DepenseDataWithId } from "../../interface/DepenseData";
import Category from "../../models/Category";
import driver from "../../dataBase/neo4j";
import { client } from "../../dataBase/redis";
import { userInfoCollection } from "../../dataBase/chromaDB";

const router = express.Router();

router.put("/update", async (req: Request<DepenseDataWithId>, res: Response<null | DepenseDataError>) => {
    const session = driver.session();

    try {
        const user = (req as any).user;
        if (!user || !user.id) {
            res.status(401).json({ message: "Utilisateur non authentifié" });
            return 
        }

        const customerId = user.id;

        const result = EditDepenseSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ message: "Données de saisie invalides"});
            return
        }

        const { _id, montant, description, date, categoryName } = result.data;
        const tags = result.data.tags || "";

        let categoryId;
        if (categoryName !== "Default") {
            const existingCategory = await Category.findOne({
                categoryName: categoryName,
                customerId: customerId
            });

            if (!existingCategory) {
                res.status(400).json({ message: "La catégorie n'existe pas" });
                return 
            }
            categoryId = existingCategory._id.toString();
        } else {
            categoryId = "Default";
        }

       
        const resultDepense = await session.run(
            `
            MATCH (u:User {id: $customerId})-[:A_FAIT]->(d:Depense {id: $uuid})
            OPTIONAL MATCH (d)-[r:APPARTIENT_A]->()
            DELETE r
            SET d.montant = $montant,
                d.description = $description,
                d.date = $date,
                d.tags = $tags
            MERGE (b:Category {name: $categoryId})
            CREATE (d)-[:APPARTIENT_A]->(b)
            RETURN d.id as depenseId
            `,
            { uuid: _id, montant, description, date, tags, categoryId, customerId }
        );

        if (resultDepense.records.length === 0) {
            res.status(404).json({ message: "Dépense non trouvée ou vous n'avez pas les droits" });
            return
        }

        await userInfoCollection.delete({
            ids: [_id]
        });

        await userInfoCollection.add({
            ids: [_id],
            documents: [
                `Dépense : ${description} ${montant}€ le ${date} - catégorie : ${categoryName}`
            ],
            metadatas: [{
                user_id: customerId,
                depense_id: _id,
                categorie: categoryName,
                type: 'depense'
            }]
        });

        
        const key = `${customerId}depenses`;
        const statKey = `${customerId}depensesStat`;

        await Promise.all([
            client.del(key),
            client.del(statKey)
        ]);

        res.status(200).json({ message: "Dépense modifiée avec succès" });
        return 

    } catch (error: any) {
        console.error("Erreur lors de la modification :", error);
        res.status(500).json({ message: "Erreur serveur" });
        return 
    } finally {
        await session.close();
    }
});

export default router;
