import express from "express";
import type { Request, Response } from "express";
import type { DepenseDataError, DepenseStatisticTotal, DepenseStatisticByMonth, DepenseStatistic } from "../../interface/DepenseData";
import { client } from "../../dataBase/redis";
import Category from "../../models/Category";
import driver from "../../dataBase/neo4j";
import { GetListDepenseResponse } from "../../interface/DepenseData";

const router = express.Router();

router.get("/statistic", async (req: Request, res: Response<DepenseDataError | DepenseStatisticTotal>) => {
    try {
        const user = (req as any).user;
        const customerId = user.id;

        const statKey = customerId + "depensesStat";
        const depenseKey = customerId + "depenses";

        
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
            // Chargement depuis Neo4j
            const session = driver.session();
            const result = await session.run(`
                MATCH (a:User {id: $customerId})-[:A_FAIT]->(c:Depense)-[:APPARTIENT_A]->(b:Category)
                RETURN c, b.name AS categoryId
            `, { customerId });

            depenses = [];

            for (const record of result.records) {
                const c = record.get('c');
                const categoryId = record.get('categoryId');

                if (categoryId !== "Default") {
                    const category = await Category.findById(categoryId);
                    if (!category) {
                        res.status(400).json({ message: "Erreur lors du chargement des catégories" });
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
                } else {
                    depenses.push({
                        _id: c.identity.toString(),
                        montant: c.properties.montant,
                        description: c.properties.description,
                        date: c.properties.date,
                        tags: c.properties.tags || "",
                        categoryName: "Default",
                        categoryColor: "#A9A9A9"
                    });
                }
            }

            await client.set(depenseKey, JSON.stringify(depenses));
            await session.close();
        }

       
        const grouped = new Map<
            string,
            Map<string, Map<string, { categoryColor: string; amount: number }>>
        >();

        for (const depense of depenses) {
            const date = new Date(depense.date);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const category = depense.categoryName;
            const color = depense.categoryColor;
            const amount = depense.montant;

            if (!grouped.has(year)) {
                grouped.set(year, new Map());
            }
            const yearMap = grouped.get(year)!;

            if (!yearMap.has(month)) {
                yearMap.set(month, new Map());
            }
            const monthMap = yearMap.get(month)!;

            if (!monthMap.has(category)) {
                monthMap.set(category, { categoryColor: color, amount: 0 });
            }
            monthMap.get(category)!.amount += amount;
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
                    amountTotal: amountTotalByMonth,
                });

                amountTotalByYear += amountTotalByMonth;
            }

            result.push({
                year,
                statistics: monthsArray,
                amountTotalByYear,
            });
        }

        
        result.sort((a, b) => a.year.localeCompare(b.year));
        for (const yearEntry of result) {
            yearEntry.statistics.sort((a, b) => a.month.localeCompare(b.month));
        }

    
        await client.set(statKey, JSON.stringify(result));

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

export default router;
