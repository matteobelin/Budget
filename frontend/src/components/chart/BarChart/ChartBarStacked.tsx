import { useState, useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import YearNavigation from "./YearNavigation";
import ChartDisplay from "./ChartDisplay";
import LoadingIndicator from "./LoadingIndicator";
import type {CategoryStat, MonthStat, YearStat, ChartDataItem,AllStat} from "@/interface/StatInterface"
import type {CategoryData} from "@/interface/CategoryInterface"

interface Props{
  data:AllStat;
  isLoading: boolean
}

export function ChartBarStacked({ data, isLoading } :Props) {
  dayjs.locale("fr");
  const today = dayjs();
  const [currentYear, setCurrentYear] = useState<dayjs.Dayjs>(dayjs().startOf("year"));

  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

  const chartData = useMemo(() => {
    const year = currentYear.format("YYYY");
    const yearData = data.find((y: YearStat) => y.year === year);
    if (!yearData) return [];

    return months.map((monthName: string, index: number) => {
      const monthNumber = String(index + 1).padStart(2, "0");
      const monthStat = yearData.statistics.find((m: MonthStat) => m.month === monthNumber);
      const categories: Record<string, number> = {};

      if (monthStat) {
        monthStat.statistics.forEach((cat: CategoryStat) => {
          categories[cat.categoryName] = cat.amount;
        });
      }

      return {
        month: monthName,
        ...categories,
      } as ChartDataItem;
    });
  }, [data, currentYear]);

  const categories = useMemo(() => {
    const year = currentYear.format("YYYY");
    const yearData = data.find((y: YearStat) => y.year === year);
    if (!yearData) return [];

    const categoryMap = new Map<string, string>();
    yearData.statistics.forEach((monthStat: MonthStat) => {
      monthStat.statistics.forEach((cat: CategoryStat) => {
        categoryMap.set(cat.categoryName, cat.categoryColor);
      });
    });

    return Array.from(categoryMap.entries()).map(([categoryName, color]) => ({ categoryName, color }));
  }, [data, currentYear]);

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    categories.forEach((category: CategoryData) => {
      config[category.categoryName] = {
        label: category.categoryName,
        color: category.color,
      };
    });
    return config;
  }, [categories]);

  const onPrev = () => {
    setCurrentYear((prev) => prev.subtract(1, "year"));
  };

  const onNext = () => {
    setCurrentYear((prev) => {
      const next = prev.add(1, "year");
      return next.isAfter(today, "year") ? prev : next;
    });
  };

  const isEmpty = chartData.length === 0 || chartData.every((item: ChartDataItem) =>
    Object.keys(item).filter(key => key !== 'month').every(key => item[key] === 0)
  );

  return (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Évolution mensuelle des dépenses sur l'année</CardTitle>
      <CardDescription>
        <YearNavigation currentYear={currentYear} onPrev={onPrev} onNext={onNext} today={today} />
      </CardDescription>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div className="w-full overflow-x-auto">
          <ChartDisplay isEmpty={isEmpty} chartData={chartData} chartConfig={chartConfig} categories={categories} />
        </div>
      )}
    </CardContent>
  </Card>
);
}

export default ChartBarStacked;
