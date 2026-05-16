import * as React from "react"
import type { Exercise, MuscleGroup } from "@/schemas"
import { ExerciseCreateSchema, MuscleGroupSchema } from "@/schemas"
import { useCreateExercise, useUpdateExercise } from "@/hooks/useExercises"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

interface ExerciseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercise?: Exercise // if provided, we are editing
}

export function ExerciseFormDialog({
  open,
  onOpenChange,
  exercise,
}: ExerciseFormDialogProps) {
  const [name, setName] = React.useState("")
  const [muscleGroup, setMuscleGroup] = React.useState<MuscleGroup | "">("")
  const [isCardio, setIsCardio] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const isEditing = !!exercise
  const { mutateAsync: createExercise, isPending: isCreating } = useCreateExercise()
  const { mutateAsync: updateExercise, isPending: isUpdating } = useUpdateExercise()
  const isPending = isCreating || isUpdating

  // Sync state when editing a different exercise
  React.useEffect(() => {
    if (open) {
      if (exercise) {
        setName(exercise.name)
        setMuscleGroup(exercise.muscle_group)
        setIsCardio(exercise.is_cardio)
      } else {
        setName("")
        setMuscleGroup("")
        setIsCardio(false)
      }
      setErrors({})
    }
  }, [open, exercise])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const result = ExerciseCreateSchema.safeParse({
      name,
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
      if (isEditing && exercise) {
        await updateExercise({ id: exercise.id, payload: result.data })
        toast.success("Exercise updated successfully")
      } else {
        await createExercise(result.data)
        toast.success("Exercise created successfully")
      }
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save exercise")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Exercise" : "Create Exercise"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
              />
              <FieldError>{errors.name}</FieldError>
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
                id="is_cardio" 
                checked={isCardio}
                onCheckedChange={(c) => setIsCardio(c === true)}
              />
              <FieldLabel htmlFor="is_cardio">Is Cardio?</FieldLabel>
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
