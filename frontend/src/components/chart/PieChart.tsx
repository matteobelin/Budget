import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import dayjs from "dayjs"
import "dayjs/locale/fr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} 

export function ChartPieDonutText() {

    dayjs.locale("fr")
    const today = dayjs()
    const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"))

    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
    }, [])

    const goToPreviousMonth = () => {
        setCurrentMonth((prev) => prev.subtract(1, "month"))
    }

    const goToNextMonth = () => {
    setCurrentMonth((prev) => {
        const nextMonth = prev.add(1, "month")
        if (nextMonth.isAfter(today, "month")) return prev
        return nextMonth
    })
    }

    return (
        <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
            <CardTitle>Répartition mensuelle des dépenses par catégorie</CardTitle>
            <div className="flex gap-2 mt-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPreviousMonth}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="inline-flex items-center justify-center text-sm font-medium  h-8 min-w-[140px]">
                    {currentMonth.format("MMMM YYYY")}
                </span>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={goToNextMonth}
                    disabled={currentMonth.isSame(today, "month")}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
            <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
            >
            <PieChart>
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
                >
                <Label
                    content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                        <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                            >
                            {totalVisitors.toLocaleString()}
                            </tspan>
                            <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-foreground text-2xl font-bold"
                            >
                            €
                            </tspan>
                        </text>
                        )
                    }
                    }}
                />
                </Pie>
            </PieChart>
            </ChartContainer>
        </CardContent>
        </Card>
    )
}
export default ChartPieDonutText
