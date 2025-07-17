import dayjs from "dayjs"
import "dayjs/locale/fr"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {

  CardHeader,
  CardTitle,
} from "@/components/ui/card"


type ChartHeaderProps = {
  currentMonth: dayjs.Dayjs
  today: dayjs.Dayjs
  onPrev: () => void
  onNext: () => void
}

function PieChartHeader({ currentMonth, today, onPrev, onNext }: ChartHeaderProps) {
  return (
    <CardHeader className="items-center pb-0">
      <CardTitle>Répartition mensuelle des dépenses par catégorie</CardTitle>
      <div className="flex gap-2 mt-2">
        <Button variant="outline" size="icon" className="cursor-pointer" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="inline-flex items-center justify-center text-sm font-medium h-8 min-w-[140px]">
          {currentMonth.format("MMMM YYYY")}
        </span>
        <Button
            className="cursor-pointer"
            variant="outline"
            size="icon"
            onClick={onNext}
            disabled={currentMonth.isSame(today, "month")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  )
}
export default PieChartHeader