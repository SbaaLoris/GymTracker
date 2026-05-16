import * as React from "react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts"
import { Scale, ArrowRight } from "lucide-react"
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

interface WeightMiniChartProps {
  data: BodyMetric[]
  onLogClick: () => void
}

const chartConfig = {
  body_weight: {
    label: "Weight",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function WeightMiniChart({ data, onLogClick }: WeightMiniChartProps) {
  // Sort data chronologically and take up to the 10 most recent entries
  const chartData = React.useMemo(() => {
    return [...data]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10)
  }, [data])

  const hasEnoughData = chartData.length >= 2

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    } catch {
      return dateStr
    }
  }

  return (
    <Card className="mova-card flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Weight Progress</CardTitle>
          <CardDescription>
            {hasEnoughData 
              ? "Your last 10 weight entries" 
              : "Track your body weight progress"}
          </CardDescription>
        </div>
        {hasEnoughData && (
          <Button variant="ghost" size="sm" onClick={onLogClick} className="gap-1">
            Log Weight <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center min-h-[280px]">
        {hasEnoughData ? (
          <ChartContainer config={chartConfig} className="h-[220px] w-full aspect-auto mt-4">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorWeightMini" x1="0" y1="0" x2="0" y2="1">
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
                style={{ fontSize: "11px", fill: "var(--muted-foreground)" }}
              />
              <YAxis
                domain={["dataMin - 2", "dataMax + 2"]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}kg`}
                width={50}
                style={{ fontSize: "11px", fill: "var(--muted-foreground)" }}
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
                fill="url(#colorWeightMini)"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Scale className="h-8 w-8 text-muted-foreground animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold">Not enough weight logs</h3>
            <p className="text-muted-foreground text-sm max-w-xs mb-4">
              Log at least two weight entries to visualize your progress chart.
            </p>
            <Button onClick={onLogClick}>
              Log Today's Weight
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
