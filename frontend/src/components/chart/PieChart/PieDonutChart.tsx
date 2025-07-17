import { Label, Pie, PieChart } from "recharts"
import "dayjs/locale/fr"
import { useMemo } from "react"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type PieDonutChartProps = {
  data: { name: string; value: number; fill: string }[]
  totalAmount: number
}

function PieDonutChart({ data, totalAmount }: PieDonutChartProps) {
  const isEmpty = data.length === 0
  const displayData = isEmpty
    ? [{ name: "Aucune dépense", value: 1, fill: "#d3d3d3" }]
    : data

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    displayData.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      }
    })
    return config
  }, [displayData])

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
      <PieChart>
        <ChartTooltip  cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie data={displayData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className={`text-3xl font-bold fill-foreground`}
                    >
                      {isEmpty ? "0" : totalAmount.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className={`text-2xl font-bold fill-foreground `}
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
  )
}

export default PieDonutChart
