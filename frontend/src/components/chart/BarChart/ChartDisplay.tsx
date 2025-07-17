import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { CategoryData } from "@/interface/CategoryInterface";
import type {ChartDataItem,ChartConfig} from "@/interface/StatInterface" 


interface Props {
  isEmpty: boolean;
  chartData: ChartDataItem[];
  chartConfig: ChartConfig;
  categories: CategoryData[];
}

const ChartDisplay = ({ isEmpty, chartData, chartConfig, categories }: Props) => {
  const chartSizeClasses = "w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"

  return (
    <div className={chartSizeClasses}>
      {isEmpty ? (
        <div className="flex justify-center items-center w-full h-full text-gray-500 bg-white rounded shadow">
          <div className="text-center">
            <p className="text-lg">Aucune dépense</p>
            <p className="text-sm">pour cette année</p>
          </div>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart width={500} height={300} data={chartData} className="w-full h-full">
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            {categories.map((cat, index) => (
              <Bar
                key={cat.categoryName}
                dataKey={cat.categoryName}
                stackId="a"
                fill={cat.color}
                radius={
                  index === 0
                    ? [0, 0, 4, 4]
                    : index === categories.length - 1
                    ? [4, 4, 0, 0]
                    : [0, 0, 0, 0]
                }
              />
            ))}
          </BarChart>
        </ChartContainer>
      )}
    </div>
  )
}

export default ChartDisplay;
