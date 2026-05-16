import * as React from "react"
import { Link } from "react-router-dom"
import { Dumbbell, Inbox, Copy, RefreshCw, ArrowRight } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { StatCard } from "@/components/shared/StatCard"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useExercises } from "@/hooks/useExercises"
import { useExerciseRequests } from "@/hooks/useExerciseRequests"
import { useWorkoutPlans } from "@/hooks/useWorkoutPlans"

function AdminDashboardSkeleton() {
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

      {/* Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-[180px] rounded-xl" />
        <Skeleton className="h-[180px] rounded-xl" />
        <Skeleton className="h-[180px] rounded-xl" />
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const exercisesQuery = useExercises({ include_inactive: true })
  const requestsQuery = useExerciseRequests()
  const templatesQuery = useWorkoutPlans(true)

  const isLoading = exercisesQuery.isLoading || requestsQuery.isLoading || templatesQuery.isLoading
  const isError = exercisesQuery.isError || requestsQuery.isError || templatesQuery.isError

  const handleRetry = () => {
    exercisesQuery.refetch()
    requestsQuery.refetch()
    templatesQuery.refetch()
  }

  const stats = React.useMemo(() => {
    const exercises = exercisesQuery.data || []
    const requests = requestsQuery.data || []
    const templates = templatesQuery.data || []

    const activeExercises = exercises.filter((e) => e.is_active).length
    const inactiveExercises = exercises.filter((e) => !e.is_active).length
    const pendingRequests = requests.filter((r) => r.status === "pending").length

    return {
      totalExercises: exercises.length,
      activeExercises,
      inactiveExercises,
      totalRequests: requests.length,
      pendingRequests,
      totalTemplates: templates.length,
    }
  }, [exercisesQuery.data, requestsQuery.data, templatesQuery.data])

  if (isLoading) {
    return (
      <AppLayout>
        <AdminDashboardSkeleton />
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
          <h2 className="text-xl font-bold">Failed to load admin dashboard data</h2>
          <p className="text-muted-foreground text-sm max-w-md mt-2 mb-6">
            There was a problem communicating with the GymTracker backend. Please check your credentials and connection.
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
        <PageHeader
          title="Admin Control Center"
          description="Manage global system settings, verify user requests, publish templates, and maintain the exercise catalog."
        />

        {/* Dynamic Metric Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Exercise Catalog"
            value={stats.totalExercises}
            unit="items"
            footerPrimary={`${stats.activeExercises} Active exercises`}
            footerSecondary={`${stats.inactiveExercises} Soft-deleted / Inactive`}
          />

          <StatCard
            title="Exercise Requests"
            value={stats.totalRequests}
            unit="submitted"
            trend={stats.pendingRequests > 0 ? `${stats.pendingRequests} PENDING` : undefined}
            trendDirection={stats.pendingRequests > 0 ? "down" : "up"} // Show alert color if there are pending
            footerPrimary={
              stats.pendingRequests > 0
                ? `${stats.pendingRequests} requests require your attention`
                : "All requests reviewed"
            }
            footerSecondary="Community proposed exercises"
            invertColor={true}
          />

          <StatCard
            title="Workout Templates"
            value={stats.totalTemplates}
            unit="templates"
            footerPrimary="Globally available workout templates"
            footerSecondary="Pre-designed routines for all athletes"
          />
        </div>

        {/* Navigation & Action Shortcuts */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight">Administrative Area Shortcuts</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Exercises Manager Card */}
            <Card className="hover:ring-2 hover:ring-primary/20 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-base font-semibold">Exercise Manager</CardTitle>
                  <CardDescription>View, create, and soft-delete exercises.</CardDescription>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Dumbbell className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Button asChild variant="outline" className="w-full justify-between group">
                  <Link to="/admin/exercises">
                    Manage Exercises
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Requests Panel Card */}
            <Card className="hover:ring-2 hover:ring-primary/20 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-base font-semibold">Review Queue</CardTitle>
                  <CardDescription>Approve or deny custom exercise requests.</CardDescription>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Inbox className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Button asChild variant="outline" className="w-full justify-between group">
                  <Link to="/admin/requests">
                    Open Review Queue
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Workout Templates Card */}
            <Card className="hover:ring-2 hover:ring-primary/20 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-base font-semibold">System Templates</CardTitle>
                  <CardDescription>Publish official workout plans for all users.</CardDescription>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Copy className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Button asChild variant="outline" className="w-full justify-between group">
                  <Link to="/admin/templates">
                    Manage Templates
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

