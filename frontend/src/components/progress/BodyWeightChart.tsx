import * as React from "react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts"
import { Scale } from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import type { BodyMetric } from "@/schemas"

interface BodyWeightChartProps {
  data: BodyMetric[]
  onLogClick: () => void
}

const chartConfig = {
  body_weight: {
    label: "Weight",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function BodyWeightChart({ data, onLogClick }: BodyWeightChartProps) {
  // Sort data chronologically (oldest to newest) for chart display
  const chartData = React.useMemo(() => {
    return [...data].sort((a, b) => a.date.localeCompare(b.date))
  }, [data])

  const hasEnoughData = chartData.length >= 2

  // Format date to local locale for presentation on XAxis
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    } catch {
      return dateStr
    }
  }

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle>Weight History</CardTitle>
          <CardDescription>
            {hasEnoughData 
              ? "Tracking your body weight progress over time." 
              : "Log at least two weight entries to visualize your progress."}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {hasEnoughData ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full aspect-auto">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-body_weight)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-body_weight)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatDate}
              />
              <YAxis
                domain={["dataMin - 3", "dataMax + 3"]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}kg`}
                width={55}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => {
                      try {
                        const date = new Date(label as string)
                        return date.toLocaleDateString(undefined, { 
                          weekday: "short", 
                          year: "numeric", 
                          month: "long", 
                          day: "numeric" 
                        })
                      } catch {
                        return String(label)
                      }
                    }}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="body_weight"
                stroke="var(--color-body_weight)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorWeight)"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="rounded-full bg-muted p-4">
              <Scale className="size-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Not enough weight entries</h3>
              <p className="text-muted-foreground max-w-sm">
                Log at least two weight entries to visualize your progress chart and track trends.
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={onLogClick}>
                Log First Weight
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
