import * as React from "react"
import type { MuscleGroup } from "@/schemas"
import { ExerciseRequestCreateSchema, MuscleGroupSchema } from "@/schemas"
import { useCreateExerciseRequest } from "@/hooks/useExerciseRequests"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { toast } from "sonner"

interface ExerciseRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExerciseRequestDialog({
  open,
  onOpenChange,
}: ExerciseRequestDialogProps) {
  const [suggestedName, setSuggestedName] = React.useState("")
  const [muscleGroup, setMuscleGroup] = React.useState<MuscleGroup | "">("")
  const [isCardio, setIsCardio] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const { mutateAsync: createRequest, isPending } = useCreateExerciseRequest()

  React.useEffect(() => {
    if (open) {
      setSuggestedName("")
      setMuscleGroup("")
      setIsCardio(false)
      setErrors({})
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const result = ExerciseRequestCreateSchema.safeParse({
      suggested_name: suggestedName,
      muscle_group: muscleGroup,
      is_cardio: isCardio,
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
      await createRequest(result.data)
      toast.success("Exercise request submitted successfully")
      onOpenChange(false)
    } catch (error) {
      const err = error as Error
      // Handle 429 Too Many Requests specifically
      if (err.message && err.message.includes("429")) {
        toast.error("You have reached the maximum number of pending requests. Please wait for an admin to review them.")
      } else {
        toast.error(err.message || "Failed to submit request")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request New Exercise</DialogTitle>
          <DialogDescription>
            Can't find the exercise you're looking for? Submit a request and an admin will review it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FieldGroup>
            <Field data-invalid={!!errors.suggested_name}>
              <FieldLabel htmlFor="suggested_name">Exercise Name</FieldLabel>
              <Input
                id="suggested_name"
                value={suggestedName}
                onChange={(e) => setSuggestedName(e.target.value)}
                aria-invalid={!!errors.suggested_name}
                placeholder="e.g., Incline Bench Press"
              />
              <FieldError>{errors.suggested_name}</FieldError>
            </Field>

            <Field data-invalid={!!errors.muscle_group}>
              <FieldLabel>Muscle Group</FieldLabel>
              <Select 
                value={muscleGroup} 
                onValueChange={(val: MuscleGroup) => setMuscleGroup(val)}
              >
                <SelectTrigger aria-invalid={!!errors.muscle_group}>
                  <SelectValue placeholder="Select a muscle group" />
                </SelectTrigger>
                <SelectContent>
                  {MuscleGroupSchema.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.muscle_group}</FieldError>
            </Field>

            <Field orientation="horizontal">
              <Checkbox 
                id="request_is_cardio" 
                checked={isCardio}
                onCheckedChange={(c) => setIsCardio(c === true)}
              />
              <FieldLabel htmlFor="request_is_cardio">Is Cardio?</FieldLabel>
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
              {isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
