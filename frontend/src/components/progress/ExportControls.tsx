import * as React from "react"
import { FileSpreadsheet, FileText, Download, Calendar } from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { useExportWorkouts, useExportBodyMetrics } from "@/hooks/useExports"
import { toast } from "sonner"
import { DatePicker } from "@/components/shared/DatePicker"

export function ExportControls() {
  // Date filters for workout sessions
  const [workoutsFrom, setWorkoutsFrom] = React.useState("")
  const [workoutsTo, setWorkoutsTo] = React.useState("")

  // Date filters for body metrics
  const [metricsFrom, setMetricsFrom] = React.useState("")
  const [metricsTo, setMetricsTo] = React.useState("")

  // Convert date strings to Date objects
  const workoutsFromDate = React.useMemo(() => {
    if (!workoutsFrom) return undefined
    const [year, month, day] = workoutsFrom.split("-").map(Number)
    return new Date(year, month - 1, day)
  }, [workoutsFrom])

  const workoutsToDate = React.useMemo(() => {
    if (!workoutsTo) return undefined
    const [year, month, day] = workoutsTo.split("-").map(Number)
    return new Date(year, month - 1, day)
  }, [workoutsTo])

  const metricsFromDate = React.useMemo(() => {
    if (!metricsFrom) return undefined
    const [year, month, day] = metricsFrom.split("-").map(Number)
    return new Date(year, month - 1, day)
  }, [metricsFrom])

  const metricsToDate = React.useMemo(() => {
    if (!metricsTo) return undefined
    const [year, month, day] = metricsTo.split("-").map(Number)
    return new Date(year, month - 1, day)
  }, [metricsTo])

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (newDate: Date | undefined) => {
    if (!newDate) {
      setter("")
      return
    }
    const year = newDate.getFullYear()
    const month = String(newDate.getMonth() + 1).padStart(2, "0")
    const day = String(newDate.getDate()).padStart(2, "0")
    setter(`${year}-${month}-${day}`)
  }

  const { mutateAsync: exportWorkoutsMutation, isPending: isWorkoutsPending } = useExportWorkouts()
  const { mutateAsync: exportMetricsMutation, isPending: isMetricsPending } = useExportBodyMetrics()

  const handleExportWorkouts = async (format: "csv" | "pdf") => {
    try {
      const filters = 
        workoutsFrom || workoutsTo 
          ? { 
              from: workoutsFrom || undefined, 
              to: workoutsTo || undefined 
            } 
          : undefined

      toast.info(`Preparing workouts ${format.toUpperCase()} export...`)
      await exportWorkoutsMutation({ format, filters })
      toast.success(`Workouts ${format.toUpperCase()} downloaded successfully.`)
    } catch (error) {
      const err = error as Error
      toast.error(err.message || "Failed to export workout sessions")
    }
  }

  const handleExportMetrics = async (format: "csv" | "pdf") => {
    try {
      const filters = 
        metricsFrom || metricsTo 
          ? { 
              from: metricsFrom || undefined, 
              to: metricsTo || undefined 
            } 
          : undefined

      toast.info(`Preparing body metrics ${format.toUpperCase()} export...`)
      await exportMetricsMutation({ format, filters })
      toast.success(`Body metrics ${format.toUpperCase()} downloaded successfully.`)
    } catch (error) {
      const err = error as Error
      toast.error(err.message || "Failed to export body metrics")
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Workouts Export Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="size-5 text-primary" />
            <CardTitle>Workout Sessions</CardTitle>
          </div>
          <CardDescription>
            Export your complete workout logging history, including sets, reps, weights, and cardio durations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Calendar className="size-4 text-muted-foreground" />
              <span>Date Filters (Optional)</span>
            </div>
            <FieldGroup className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="workouts-from">From</FieldLabel>
                <DatePicker
                  id="workouts-from"
                  date={workoutsFromDate}
                  onChange={handleDateChange(setWorkoutsFrom)}
                  placeholder="Select date"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="workouts-to">To</FieldLabel>
                <DatePicker
                  id="workouts-to"
                  date={workoutsToDate}
                  onChange={handleDateChange(setWorkoutsTo)}
                  placeholder="Select date"
                />
              </Field>
            </FieldGroup>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 gap-2"
              variant="outline"
              disabled={isWorkoutsPending}
              onClick={() => handleExportWorkouts("csv")}
            >
              <FileSpreadsheet className="size-4 text-green-600" />
              Export CSV
            </Button>
            <Button
              className="flex-1 gap-2"
              variant="outline"
              disabled={isWorkoutsPending}
              onClick={() => handleExportWorkouts("pdf")}
            >
              <FileText className="size-4 text-red-500" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Body Metrics Export Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="size-5 text-primary" />
            <CardTitle>Body Weight Metrics</CardTitle>
          </div>
          <CardDescription>
            Export your weight tracking log to CSV or print/save a formatted PDF document.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Calendar className="size-4 text-muted-foreground" />
              <span>Date Filters (Optional)</span>
            </div>
            <FieldGroup className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="metrics-from">From</FieldLabel>
                <DatePicker
                  id="metrics-from"
                  date={metricsFromDate}
                  onChange={handleDateChange(setMetricsFrom)}
                  placeholder="Select date"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="metrics-to">To</FieldLabel>
                <DatePicker
                  id="metrics-to"
                  date={metricsToDate}
                  onChange={handleDateChange(setMetricsTo)}
                  placeholder="Select date"
                />
              </Field>
            </FieldGroup>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 gap-2"
              variant="outline"
              disabled={isMetricsPending}
              onClick={() => handleExportMetrics("csv")}
            >
              <FileSpreadsheet className="size-4 text-green-600" />
              Export CSV
            </Button>
            <Button
              className="flex-1 gap-2"
              variant="outline"
              disabled={isMetricsPending}
              onClick={() => handleExportMetrics("pdf")}
            >
              <FileText className="size-4 text-red-500" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
