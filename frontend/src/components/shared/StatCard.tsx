import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string | number
    unit?: string
    trend?: string
    trendDirection?: "up" | "down"
    footerPrimary?: string
    footerSecondary?: string
    icon?: LucideIcon
    className?: string
}

export function StatCard({
    title,
    value,
    unit,
    trend,
    trendDirection,
    footerPrimary,
    footerSecondary,
    className
}: StatCardProps) {
    const isPositive = trendDirection === "up"

    return (
        <Card className={cn("mova-card p-6 gap-5", className)}>
            <CardHeader className="p-0">
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-3xl font-bold leading-none tracking-tight tabular-nums mova-stat">
                    {value}
                    {unit && (
                        <span className="ml-1 text-sm font-semibold text-muted-foreground tracking-normal">
                            {unit}
                        </span>
                    )}
                </CardTitle>
                {trend && (
                    <CardAction>
                        <Badge
                            variant="outline"
                            className={cn(
                                "rounded-full h-6 px-2 gap-1 font-semibold text-[10px] uppercase tracking-wider",
                                isPositive 
                                    ? "bg-success/10 text-success border-success/20" 
                                    : "bg-destructive/10 text-destructive border-destructive/20"
                            )}
                        >
                            {isPositive ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            {trend}
                        </Badge>
                    </CardAction>
                )}
            </CardHeader>

            {(footerPrimary || footerSecondary) && (
                <div className="flex flex-col items-start gap-1 p-0 text-sm">
                    {footerPrimary && (
                        <div className="inline-flex items-center gap-1.5 font-medium leading-relaxed">
                            {footerPrimary}
                            {trendDirection === "up" && <TrendingUp className="w-3.5 h-3.5" />}
                            {trendDirection === "down" && <TrendingDown className="w-3.5 h-3.5" />}
                        </div>
                    )}
                    {footerSecondary && (
                        <div className="text-muted-foreground leading-relaxed">
                            {footerSecondary}
                        </div>
                    )}
                </div>
            )}
        </Card>
    )
}
