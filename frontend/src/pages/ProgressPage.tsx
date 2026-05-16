import * as React from "react"
import { Plus, Scale, RefreshCw } from "lucide-react"
import { AppLayout } from "@/components/layout/AppLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "@/components/shared/StatCard"
import { BodyWeightChart } from "@/components/progress/BodyWeightChart"
import { BodyMetricTable } from "@/components/progress/BodyMetricTable"
import { ExportControls } from "@/components/progress/ExportControls"
import { BodyMetricFormDialog } from "@/components/progress/BodyMetricFormDialog"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { useBodyMetrics, useDeleteBodyMetric } from "@/hooks/useBodyMetrics"
import { toast } from "sonner"
import type { BodyMetric } from "@/schemas"

export default function ProgressPage() {
  const { data: metrics = [], isLoading, error, refetch } = useBodyMetrics()
  const { mutateAsync: deleteMetric } = useDeleteBodyMetric()

  // Form states
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedMetric, setSelectedMetric] = React.useState<BodyMetric | undefined>(undefined)

  // Confirm delete states
  const [deletingMetric, setDeletingMetric] = React.useState<BodyMetric | null>(null)

  // Calculate statistics chronologically
  const stats = React.useMemo(() => {
    if (!metrics || metrics.length === 0) return null
    
    // Sort oldest to newest
    const sorted = [...metrics].sort((a, b) => a.date.localeCompare(b.date))
    const first = sorted[0].body_weight
    const latest = sorted[sorted.length - 1].body_weight
    const diff = latest - first
    
    return {
      current: latest,
      starting: first,
      change: diff,
      trend: diff > 0 ? "up" as const : diff < 0 ? "down" as const : undefined
    }
  }, [metrics])

  const handleCreateClick = () => {
    setSelectedMetric(undefined)
    setIsFormOpen(true)
  }

  const handleEditClick = (metric: BodyMetric) => {
    setSelectedMetric(metric)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (metric: BodyMetric) => {
    setDeletingMetric(metric)
  }

  const handleConfirmDelete = async () => {
    if (!deletingMetric) return
    try {
      await deleteMetric(deletingMetric.id)
      toast.success("Weight entry deleted successfully")
    } catch (err) {
      const errorMsg = (err as Error).message || "Failed to delete weight entry"
      toast.error(errorMsg)
    } finally {
      setDeletingMetric(null)
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Progress & Exports"
          description="Track your body weight metrics, analyze visual charts, and export your training data."
          actions={
            <Button onClick={handleCreateClick} className="gap-1.5">
              <Plus className="size-4" />
              Log Weight
            </Button>
          }
        />

        {error ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-12 text-center">
            <h3 className="text-lg font-semibold text-destructive">Failed to load body metrics</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              We encountered an error while trying to fetch your body weight logs from the server.
            </p>
            <Button variant="outline" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="size-4" />
              Retry Connection
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="weight" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="weight">Weight Tracking</TabsTrigger>
              <TabsTrigger value="exports">Data Exports</TabsTrigger>
            </TabsList>

            {/* WEIGHT TRACKING TAB */}
            <TabsContent value="weight" className="mt-6 flex flex-col gap-6">
              {/* StatCards Row */}
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  title="Current Weight"
                  value={stats ? stats.current.toFixed(1) : "—"}
                  unit={stats ? "kg" : undefined}
                  footerSecondary={
                    metrics.length > 0 
                      ? `Last logged on ${new Date([...metrics].sort((a, b) => b.date.localeCompare(a.date))[0].date).toLocaleDateString()}`
                      : "No records logged yet"
                  }
                />
                <StatCard
                  title="Starting Weight"
                  value={stats ? stats.starting.toFixed(1) : "—"}
                  unit={stats ? "kg" : undefined}
                  footerSecondary={
                    metrics.length > 0
                      ? `First logged on ${new Date([...metrics].sort((a, b) => a.date.localeCompare(b.date))[0].date).toLocaleDateString()}`
                      : "No records logged yet"
                  }
                />
                <StatCard
                  title="Total Change"
                  value={stats ? `${stats.change > 0 ? "+" : ""}${stats.change.toFixed(1)}` : "—"}
                  unit={stats ? "kg" : undefined}
                  trend={stats && stats.change !== 0 ? `${Math.abs(stats.change).toFixed(1)} kg` : undefined}
                  trendDirection={stats ? stats.trend : undefined}
                  invertColor={true}
                  footerSecondary={
                    stats && stats.change !== 0
                      ? stats.change > 0 
                        ? "Overall weight gain" 
                        : "Overall weight loss"
                      : "No net weight change"
                  }
                />
              </div>

              {/* Weight Chart */}
              <BodyWeightChart data={metrics} onLogClick={handleCreateClick} />

              {/* Weight History Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="size-4 text-primary" />
                    <h3 className="font-semibold text-base">Weight History Log</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {metrics.length} entries total
                  </span>
                </div>
                <BodyMetricTable
                  data={metrics}
                  isLoading={isLoading}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </div>
            </TabsContent>

            {/* EXPORTS TAB */}
            <TabsContent value="exports" className="mt-6">
              <ExportControls />
            </TabsContent>
          </Tabs>
        )}

        {/* Create/Edit Form Dialog */}
        <BodyMetricFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          metric={selectedMetric}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={!!deletingMetric}
          onOpenChange={(open) => !open && setDeletingMetric(null)}
          title="Delete Weight Entry?"
          description={`Are you sure you want to delete the weight entry of ${deletingMetric?.body_weight.toFixed(1)} kg logged on ${deletingMetric ? new Date(deletingMetric.date).toLocaleDateString() : ""}? This action cannot be undone.`}
          confirmText="Delete Entry"
          onConfirm={handleConfirmDelete}
          variant="destructive"
        />
      </div>
    </AppLayout>
  )
}
