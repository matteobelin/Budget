import dayjs from "dayjs"
import "dayjs/locale/fr"
import { useState,useMemo } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

import PieDonutChart from "./PieDonutChart"
import PieChartHeader from "./PieChartHeader"
import type { AllStat } from "@/interface/StatInterface"

interface Props{
  data:AllStat;
  isLoading: boolean
}

export default function ChartPieDonutText({data,isLoading}:Props) {
  dayjs.locale("fr")
  const today = dayjs()
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"))



  const monthData = useMemo(() => {
    const year = currentMonth.format("YYYY")
    const month = currentMonth.format("MM")
    const yearData = data.find((y) => y.year === year)
    if (!yearData) return []
    const monthStat = yearData.statistics.find((m) => m.month === month)
    if (!monthStat) return []
    return monthStat.statistics.map((cat) => ({
      name: cat.categoryName,
      value: cat.amount,
      fill: cat.categoryColor,
    }))
  }, [data, currentMonth])

  const totalAmount = useMemo(() => {
    return monthData.reduce((acc, curr) => acc + curr.value, 0)
  }, [monthData])

  return (
    <Card className="flex flex-col">
      <PieChartHeader
        currentMonth={currentMonth}
        today={today}
        onPrev={() => setCurrentMonth((prev) => prev.subtract(1, "month"))}
        onNext={() => setCurrentMonth((prev) => {
          const next = prev.add(1, "month")
          return next.isAfter(today, "month") ? prev : next
        })}
      />
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">Chargement...</div>
        ) : (
          <PieDonutChart data={monthData} totalAmount={totalAmount} />
        )}
      </CardContent>
    </Card>
  )
}
