import express from "express";
import { EditDepenseSchema } from "../../schema/DepenseSchema";
import type { Request, Response } from "express";
import type { DepenseDataError, DepenseDataWithId } from "../../interface/DepenseData";
import driver from "../../dataBase/neo4j";
import { client } from "../../dataBase/redis";
import { userInfoCollection } from "../../dataBase/chromaDB";

const router = express.Router();

router.delete("/delete", async (req: Request<DepenseDataWithId>, res: Response<null | DepenseDataError>) => {
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
            res.status(400).json({ message: "Données de saisie invalides" });
            return 
        }

        const { _id } = result.data; 

        
        const neo4jResult = await session.run(
            `
            MATCH (d:Depense {id: $uuid})
            DETACH DELETE d
            RETURN COUNT(d) AS deletedCount
            `,
            { uuid: _id }
        );

        const deletedCount = neo4jResult.records[0].get("deletedCount").toNumber();

        if (deletedCount === 0) {
            res.status(404).json({ message: "Dépense non trouvée ou déjà supprimée" });
            return
        }

        
        await userInfoCollection.delete({
            ids: [_id]
        });

        
        const key = `${customerId}depenses`;
        const statKey = `${customerId}depensesStat`;

        await Promise.all([
            client.del(key),
            client.del(statKey)
        ]);

        res.status(200).json({ message: "Dépense supprimée avec succès" });

    } catch (error: any) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: "Erreur serveur" });
    } finally {
        await session.close();
    }
});

export default router;
