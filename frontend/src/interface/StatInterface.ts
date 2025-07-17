export type CategoryStat = {
  categoryName: string
  categoryColor: string
  amount: number
}

export type MonthStat = {
  month: string
  statistics: CategoryStat[]
  amountTotal: number
}

export type YearStat = {
  year: string
  statistics: MonthStat[]
  amountTotalByYear: number
}

export type AllStat = YearStat[]

export interface ChartDataItem {
  month: string;
  [key: string]: number | string;
}
export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}