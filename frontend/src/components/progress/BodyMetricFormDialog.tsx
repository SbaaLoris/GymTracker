import * as React from "react"
import type { BodyMetric } from "@/schemas"
import { BodyMetricCreateSchema } from "@/schemas"
import { useUpsertBodyMetric, useUpdateBodyMetric } from "@/hooks/useBodyMetrics"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { toast } from "sonner"
import { ApiError } from "@/api/client"
import { DatePicker } from "@/components/shared/DatePicker"

interface BodyMetricFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  metric?: BodyMetric // If provided, we are in edit mode
}

export function BodyMetricFormDialog({
  open,
  onOpenChange,
  metric,
}: BodyMetricFormDialogProps) {
  const [date, setDate] = React.useState("")
  const [weight, setWeight] = React.useState("")
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Convert "YYYY-MM-DD" string to local Date object
  const dateValue = React.useMemo(() => {
    if (!date) return undefined
    const [year, month, day] = date.split("-").map(Number)
    return new Date(year, month - 1, day)
  }, [date])

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) {
      setDate("")
      return
    }
    const year = newDate.getFullYear()
    const month = String(newDate.getMonth() + 1).padStart(2, "0")
    const day = String(newDate.getDate()).padStart(2, "0")
    setDate(`${year}-${month}-${day}`)
  }

  const isEditing = !!metric
  const { mutateAsync: upsertMetric, isPending: isUpserting } = useUpsertBodyMetric()
  const { mutateAsync: updateMetric, isPending: isUpdating } = useUpdateBodyMetric()
  const isPending = isUpserting || isUpdating

  // Sync state when open state or metric changes
  React.useEffect(() => {
    if (open) {
      if (metric) {
        setDate(metric.date)
        setWeight(metric.body_weight.toString())
      } else {
        // Default to today's date in local time YYYY-MM-DD
        const today = new Date()
        const localDate = today.getFullYear() + "-" + 
          String(today.getMonth() + 1).padStart(2, "0") + "-" + 
          String(today.getDate()).padStart(2, "0")
        setDate(localDate)
        setWeight("")
      }
      setErrors({})
    }
  }, [open, metric])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const weightNum = parseFloat(weight)
    
    // Validate with BodyMetricCreateSchema
    const result = BodyMetricCreateSchema.safeParse({
      date,
      body_weight: isNaN(weightNum) ? 0 : weightNum,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    try {
      if (isEditing && metric) {
        await updateMetric({ metricId: metric.id, payload: result.data })
        toast.success("Weight entry updated successfully")
      } else {
        await upsertMetric(result.data)
        toast.success("Weight entry saved successfully")
      }
      onOpenChange(false)
    } catch (error) {
      const err = error as Error
      if (error instanceof ApiError && error.status === 409) {
        // Date conflict error from backend
        toast.error("An entry for this date already exists.")
        setErrors({ date: "An entry for this date already exists." })
      } else {
        toast.error(err.message || "Failed to save weight entry")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Weight Entry" : "Log Weight"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FieldGroup>
            <Field data-invalid={!!errors.date}>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <DatePicker
                id="date"
                date={dateValue}
                onChange={handleDateChange}
                disabled={isEditing}
              />
              <FieldError>{errors.date}</FieldError>
            </Field>

            <Field data-invalid={!!errors.body_weight}>
              <FieldLabel htmlFor="body_weight">Weight (kg)</FieldLabel>
              <Input
                id="body_weight"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="e.g. 75.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                aria-invalid={!!errors.body_weight}
              />
              <FieldError>{errors.body_weight}</FieldError>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
