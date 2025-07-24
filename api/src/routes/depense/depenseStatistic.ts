import express from "express";
import type { Request, Response } from "express";
import type { DepenseDataError, DepenseStatisticTotal, DepenseStatisticByMonth, DepenseStatistic } from "../../interface/DepenseData";
import { client } from "../../dataBase/redis";
import Category from "../../models/Category";
import driver from "../../dataBase/neo4j";
import { GetListDepenseResponse } from "../../interface/DepenseData";

const router = express.Router();

router.get("/statistic", async (req: Request, res: Response<DepenseDataError | DepenseStatisticTotal>) => {
    const user = (req as any).user;
    if (!user || !user.id) {
        res.status(401).json({ message: "Utilisateur non authentifié" });
        return;
    }

    const customerId = user.id;
    const statKey = `${customerId}depensesStat`;
    const depenseKey = `${customerId}depenses`;

    let session;

    try {
        const cachedStats = await client.get(statKey);
        if (cachedStats) {
            res.status(200).json(JSON.parse(cachedStats));
            return;
        }

        let depenses: GetListDepenseResponse;

        const rawDepensesData = await client.get(depenseKey);
        if (rawDepensesData) {
            depenses = JSON.parse(rawDepensesData);
        } else {
            session = driver.session();
            
            const result = await session.run(`
                MATCH (u:User {id: $customerId})-[:A_FAIT]->(d:Depense)-[:APPARTIENT_A]->(c:Category)
                RETURN 
                    d.id AS depenseId,
                    d.montant AS montant,
                    d.description AS description,
                    d.date AS date,
                    d.tags AS tags,
                    c.name AS categoryId
                ORDER BY d.date
            `, { customerId });

            const categoryIds = [...new Set(
                result.records
                    .map(record => record.get('categoryId'))
                    .filter(id => id !== "Default")
            )];

            const categories = await Category.find({ _id: { $in: categoryIds } });
            const categoryMap = new Map(
                categories.map(cat => [cat._id.toString(), { name: cat.categoryName, color: cat.color }])
            );

            depenses = result.records.map(record => {
                const categoryId = record.get('categoryId');
                let categoryName = "Default";
                let categoryColor = "#A9A9A9";

                if (categoryId !== "Default") {
                    const categoryInfo = categoryMap.get(categoryId);
                    if (categoryInfo) {
                        categoryName = categoryInfo.name;
                        categoryColor = categoryInfo.color;
                    }
                }

                return {
                    _id: record.get('depenseId'),
                    montant: record.get('montant'),
                    description: record.get('description'),
                    date: record.get('date'),
                    tags: record.get('tags') || "",
                    categoryName,
                    categoryColor
                };
            });

            await client.set(depenseKey, JSON.stringify(depenses));
        }

        const grouped = new Map<
            string,
            Map<string, Map<string, { categoryColor: string; amount: number }>>
        >();

        for (const depense of depenses) {
            const date = new Date(depense.date);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const { categoryName, categoryColor, montant } = depense;

            if (!grouped.has(year)) grouped.set(year, new Map());
            const yearMap = grouped.get(year)!;

            if (!yearMap.has(month)) yearMap.set(month, new Map());
            const monthMap = yearMap.get(month)!;

            if (!monthMap.has(categoryName)) {
                monthMap.set(categoryName, { categoryColor, amount: 0 });
            }
            monthMap.get(categoryName)!.amount += montant;
        }

        const result: DepenseStatisticTotal = [];

        for (const [year, monthsMap] of grouped.entries()) {
            let amountTotalByYear = 0;
            const monthsArray: DepenseStatisticByMonth[] = [];

            for (const [month, categoriesMap] of monthsMap.entries()) {
                let amountTotalByMonth = 0;
                const stats: DepenseStatistic[] = [];

                for (const [categoryName, { categoryColor, amount }] of categoriesMap.entries()) {
                    stats.push({ categoryName, categoryColor, amount });
                    amountTotalByMonth += amount;
                }

                monthsArray.push({
                    month,
                    statistics: stats,
                    amountTotal: amountTotalByMonth
                });

                amountTotalByYear += amountTotalByMonth;
            }

            result.push({
                year,
                statistics: monthsArray,
                amountTotalByYear
            });
        }

        result.sort((a, b) => a.year.localeCompare(b.year));
        for (const yearEntry of result) {
            yearEntry.statistics.sort((a, b) => a.month.localeCompare(b.month));
        }

        await client.set(statKey, JSON.stringify(result));

        res.status(200).json(result);

    } catch (error: any) {
        console.error("Erreur lors des statistiques :", error);
        res.status(500).json({ message: "Erreur serveur" });
    } finally {
        if (session) await session.close();
    }
});

export default router;