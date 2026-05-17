import { useState } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useExercises } from '@/hooks/useExercises'
import { MuscleGroupIcon } from '@/components/shared/MuscleGroupIcon'
import type { WorkoutPlanCreate, PlanExerciseInput } from '@/schemas/workout-plan'
import { WorkoutPlanCreateSchema } from '@/schemas/workout-plan'
import { formatZodError } from '@/lib/error-utils'
import { toast } from 'sonner'

interface PlanEditorProps {
  initialData?: Partial<WorkoutPlanCreate>
  onSubmit: (data: WorkoutPlanCreate) => void
  isLoading?: boolean
  submitLabel: string
  isAdmin?: boolean
}

export function PlanEditor({ 
  initialData, 
  onSubmit, 
  isLoading, 
  submitLabel,
  isAdmin = false
}: PlanEditorProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [isTemplate, setIsTemplate] = useState(initialData?.is_template || false)
  const [exercises, setExercises] = useState<PlanExerciseInput[]>(
    initialData?.exercises || []
  )

  const { data: availableExercises } = useExercises({ is_cardio: false })

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        exercise_id: 0,
        order_index: exercises.length + 1,
        target_sets: 3,
        target_reps: 10,
        target_weight: null
      }
    ])
  }

  const handleRemoveExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index)
    // Update order_index
    setExercises(newExercises.map((ex, i) => ({ ...ex, order_index: i + 1 })))
  }

  const handleUpdateExercise = (index: number, updates: Partial<PlanExerciseInput>) => {
    const newExercises = [...exercises]
    newExercises[index] = { ...newExercises[index], ...updates }
    setExercises(newExercises)
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === exercises.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newExercises = [...exercises]
    const temp = newExercises[index]
    newExercises[index] = newExercises[newIndex]
    newExercises[newIndex] = temp

    // Update order_index for all
    setExercises(newExercises.map((ex, i) => ({ ...ex, order_index: i + 1 })))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: WorkoutPlanCreate = {
      name,
      is_template: isTemplate,
      exercises
    }

    const result = WorkoutPlanCreateSchema.safeParse(payload)
    if (!result.success) {
      toast.error(formatZodError(result.error))
      return
    }

    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="plan-name">Plan Name</FieldLabel>
          <Input 
            id="plan-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Push Day"
            required
          />
        </Field>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="is-template"
              checked={isTemplate}
              onChange={(e) => setIsTemplate(e.target.checked)}
              className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="is-template">Save as public template</Label>
          </div>
        )}
      </FieldGroup>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Exercises</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddExercise} className="gap-2">
            <Plus className="size-4" data-icon />
            Add Exercise
          </Button>
        </div>

        {exercises.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
            No exercises added yet.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {exercises.map((ex, index) => (
              <div 
                key={index} 
                className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/20"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <Field>
                      <FieldLabel>Exercise</FieldLabel>
                      <Select 
                        value={ex.exercise_id ? String(ex.exercise_id) : ""} 
                        onValueChange={(val) => handleUpdateExercise(index, { exercise_id: Number(val) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select exercise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {availableExercises?.map((item) => (
                              <SelectItem key={item.id} value={String(item.id)}>
                                <MuscleGroupIcon muscleGroup={item.muscle_group} className="size-4" />
                                {item.name}
                                <span className="text-xs text-muted-foreground">
                                  {item.muscle_group}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  <div className="flex flex-col gap-1 pt-6">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="size-8"
                    >
                      <ArrowUp className="size-4" data-icon />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === exercises.length - 1}
                      className="size-8"
                    >
                      <ArrowDown className="size-4" data-icon />
                    </Button>
                  </div>

                  <div className="pt-6">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveExercise(index)}
                      className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" data-icon />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel>Sets</FieldLabel>
                    <Input 
                      type="number" 
                      min={1}
                      value={ex.target_sets}
                      onChange={(e) => handleUpdateExercise(index, { target_sets: Number(e.target.value) })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Reps</FieldLabel>
                    <Input 
                      type="number" 
                      min={1}
                      value={ex.target_reps}
                      onChange={(e) => handleUpdateExercise(index, { target_reps: Number(e.target.value) })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Weight (kg)</FieldLabel>
                    <Input 
                      type="number" 
                      min={0}
                      step={0.5}
                      value={ex.target_weight === null ? "" : ex.target_weight}
                      onChange={(e) => handleUpdateExercise(index, { target_weight: e.target.value ? Number(e.target.value) : null })}
                      placeholder="Optional"
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : submitLabel}
      </Button>
    </form>
  )
}
