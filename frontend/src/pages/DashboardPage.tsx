import * as React from "react"
import { Link } from "react-router-dom"
import { Scale, Plus, RefreshCw } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { StatCard } from "@/components/shared/StatCard"
import { RecentSessions } from "@/components/dashboard/RecentSessions"
import { WeightMiniChart } from "@/components/dashboard/WeightMiniChart"
import { BodyMetricFormDialog } from "@/components/progress/BodyMetricFormDialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/auth/AuthContext"
import { useWorkoutSessions } from "@/hooks/useWorkoutSessions"
import { useBodyMetrics } from "@/hooks/useBodyMetrics"
import { useExercises } from "@/hooks/useExercises"

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>

      {/* Content Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[400px] rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [isWeightDialogOpen, setIsWeightDialogOpen] = React.useState(false)

  // Query Hooks
  const sessionsQuery = useWorkoutSessions()
  const metricsQuery = useBodyMetrics()
  const exercisesQuery = useExercises()

  const isLoading =
    sessionsQuery.isLoading || metricsQuery.isLoading || exercisesQuery.isLoading
  const isError =
    sessionsQuery.isError || metricsQuery.isError || exercisesQuery.isError

  // Reference for queries reloading
  const handleRetry = () => {
    sessionsQuery.refetch()
    metricsQuery.refetch()
    exercisesQuery.refetch()
  }

  // Formatting helpers
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  // --- Dynamic Stats Calculations ---

  // 1. Workout Sessions Stats
  const sessions = React.useMemo(() => sessionsQuery.data || [], [sessionsQuery.data])
  const totalSessions = sessions.length

  const sessionsThisMonth = React.useMemo(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = String(now.getMonth() + 1).padStart(2, "0")
    const startOfMonthStr = `${currentYear}-${currentMonth}-01`
    return sessions.filter((s) => s.date >= startOfMonthStr).length
  }, [sessions])

  // 2. Latest Workout Session
  const latestSession = React.useMemo(() => {
    if (sessions.length === 0) return null
    return [...sessions].sort((a, b) => b.date.localeCompare(a.date))[0]
  }, [sessions])

  // 3. Weight Metrics Stats
  const metrics = React.useMemo(() => metricsQuery.data || [], [metricsQuery.data])
  const latestWeightMetric = React.useMemo(() => {
    if (metrics.length === 0) return null
    return [...metrics].sort((a, b) => b.date.localeCompare(a.date))[0]
  }, [metrics])

  const previousWeightMetric = React.useMemo(() => {
    if (metrics.length < 2) return null
    const sorted = [...metrics].sort((a, b) => b.date.localeCompare(a.date))
    return sorted[1]
  }, [metrics])

  const weightTrend = React.useMemo(() => {
    if (!latestWeightMetric || !previousWeightMetric) return null
    const diff = latestWeightMetric.body_weight - previousWeightMetric.body_weight
    if (Math.abs(diff) < 0.05) return null // Negligible change
    return {
      value: `${diff > 0 ? "+" : ""}${diff.toFixed(1)} kg`,
      direction: diff > 0 ? ("up" as const) : ("down" as const),
    }
  }, [latestWeightMetric, previousWeightMetric])

  if (isLoading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    )
  }

  if (isError) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="rounded-full bg-destructive/10 p-4 text-destructive mb-4">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
          <h2 className="text-xl font-bold">Failed to load dashboard data</h2>
          <p className="text-muted-foreground text-sm max-w-md mt-2 mb-6">
            There was a problem communicating with the GymTracker backend. Please verify your connection or try again.
          </p>
          <Button onClick={handleRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        {/* Page Header with Quick Actions */}
        <PageHeader
          title={`Welcome back, ${user?.username || "Athlete"}`}
          description="Here is your gym activity and body metrics overview."
          actions={
            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="gap-1.5 shadow-sm">
                <Link to="/workouts/new">
                  <Plus className="h-4 w-4" /> Log Workout
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWeightDialogOpen(true)}
                className="gap-1.5"
              >
                <Scale className="h-4 w-4" /> Log Weight
              </Button>
            </div>
          }
        />

        {/* 3 Summary Stat Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Total Sessions"
            value={totalSessions}
            unit="workouts"
            footerPrimary={`${sessionsThisMonth} logged this month`}
            footerSecondary="Keep up the great momentum!"
          />

          <StatCard
            title="Latest Weight"
            value={latestWeightMetric ? latestWeightMetric.body_weight : "—"}
            unit={latestWeightMetric ? "kg" : undefined}
            trend={weightTrend?.value}
            trendDirection={weightTrend?.direction}
            footerPrimary={
              latestWeightMetric
                ? `Logged on ${formatDate(latestWeightMetric.date)}`
                : "No weight metrics logged yet"
            }
            footerSecondary={
              weightTrend
                ? `Compared to previous log`
                : "Enter two logs to track trend"
            }
            invertColor={true} // Usually downward trend or minimal fluctuation is target for weight tracking
          />

          <StatCard
            title="Last Workout"
            value={latestSession ? formatDate(latestSession.date) : "—"}
            footerPrimary={
              latestSession
                ? `${latestSession.sets.length} total sets performed`
                : "Time to schedule a session!"
            }
            footerSecondary={
              latestSession?.plan_id
                ? "Plan-based workout logged"
                : latestSession
                ? "Freestyle workout logged"
                : "Build your consistency"
            }
          />
        </div>

        {/* Dynamic Charts & History Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentSessions sessions={sessions} exercises={exercisesQuery.data || []} />
          <WeightMiniChart
            data={metrics}
            onLogClick={() => setIsWeightDialogOpen(true)}
          />
        </div>

        {/* Weight Dialog Wrapper */}
        <BodyMetricFormDialog
          open={isWeightDialogOpen}
          onOpenChange={setIsWeightDialogOpen}
        />
      </div>
    </AppLayout>
  )
}
