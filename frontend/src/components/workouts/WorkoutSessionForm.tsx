import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus } from 'lucide-react'
import { WorkoutSessionCreateSchema, type WorkoutSessionCreate } from '@/schemas'
import type { Exercise } from '@/schemas'
import { Card, CardContent } from '@/components/ui/card'

interface WorkoutSessionFormProps {
  defaultValues?: Partial<WorkoutSessionCreate>
  exercises: Exercise[]
  onSubmit: (data: WorkoutSessionCreate) => void
  isPending: boolean
}

export function WorkoutSessionForm({ defaultValues, exercises, onSubmit, isPending }: WorkoutSessionFormProps) {
  const form = useForm<WorkoutSessionCreate>({
    resolver: zodResolver(WorkoutSessionCreateSchema),
    defaultValues: {
      date: defaultValues?.date || new Date().toISOString().split('T')[0],
      plan_id: defaultValues?.plan_id || null,
      sets: defaultValues?.sets || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'sets',
  })

  const handleAddSet = () => {
    const first = exercises[0]
    if (first?.is_cardio) {
      append({
        type: 'cardio',
        exercise_id: first.id,
        duration: 15,
      })
    } else {
      append({
        type: 'strength',
        exercise_id: first?.id || 0,
        reps: 10,
        weight: 0,
      })
    }
  }

  // Handle exercise change to correctly switch between strength and cardio
  const handleExerciseChange = (index: number, exerciseId: string) => {
    const id = parseInt(exerciseId, 10)
    const exercise = exercises.find(e => e.id === id)
    if (!exercise) return

    if (exercise.is_cardio) {
      form.setValue(`sets.${index}`, {
        type: 'cardio',
        exercise_id: id,
        duration: 15, // Default duration
      })
    } else {
      form.setValue(`sets.${index}`, {
        type: 'strength',
        exercise_id: id,
        reps: 10,
        weight: 0,
      })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.date}>
          <FieldLabel htmlFor="date">Workout Date</FieldLabel>
          <Input 
            id="date" 
            type="date" 
            {...form.register('date')} 
            aria-invalid={!!form.formState.errors.date}
          />
          {form.formState.errors.date && (
            <FieldDescription className="text-destructive">
              {form.formState.errors.date.message}
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Workout Sets</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddSet}>
            <Plus data-icon="inline-start" />
            Add Set
          </Button>
        </div>

        {form.formState.errors.sets?.root && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.sets.root.message}
          </p>
        )}

        <div className="flex flex-col gap-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {fields.map((field: any, index: number) => {
            const setType = form.watch(`sets.${index}.type`)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const setErrors = form.formState.errors.sets?.[index] as any
            const exerciseError = setErrors?.exercise_id

            return (
              <Card key={field.id}>
                <CardContent className="p-4 flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex-1">
                    <Field data-invalid={!!exerciseError}>
                      <FieldLabel className="sr-only">Exercise</FieldLabel>
                      <Select
                        value={form.watch(`sets.${index}.exercise_id`)?.toString() || ''}
                        onValueChange={(val) => handleExerciseChange(index, val)}
                      >
                        <SelectTrigger aria-invalid={!!exerciseError}>
                          <SelectValue placeholder="Select Exercise" />
                        </SelectTrigger>
                        <SelectContent>
                          {exercises.map((ex) => (
                            <SelectItem key={ex.id} value={ex.id.toString()}>
                              {ex.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {exerciseError && (
                        <FieldDescription className="text-destructive">
                          {exerciseError.message}
                        </FieldDescription>
                      )}
                    </Field>
                  </div>

                  {setType === 'strength' ? (
                    <div className="flex items-center gap-4 flex-1">
                      <Field className="flex-1" data-invalid={!!setErrors?.reps}>
                        <FieldLabel className="sr-only">Reps</FieldLabel>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Reps"
                            {...form.register(`sets.${index}.reps` as const, { valueAsNumber: true })}
                            aria-invalid={!!setErrors?.reps}
                          />
                          <span className="text-sm text-muted-foreground whitespace-nowrap">reps</span>
                        </div>
                      </Field>
                      <Field className="flex-1" data-invalid={!!setErrors?.weight}>
                        <FieldLabel className="sr-only">Weight</FieldLabel>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="0.5"
                            placeholder="Weight"
                            {...form.register(`sets.${index}.weight` as const, { valueAsNumber: true })}
                            aria-invalid={!!setErrors?.weight}
                          />
                          <span className="text-sm text-muted-foreground whitespace-nowrap">kg</span>
                        </div>
                      </Field>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 flex-1">
                      <Field className="flex-1" data-invalid={!!setErrors?.duration}>
                        <FieldLabel className="sr-only">Duration</FieldLabel>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Duration"
                            {...form.register(`sets.${index}.duration` as const, { valueAsNumber: true })}
                            aria-invalid={!!setErrors?.duration}
                          />
                          <span className="text-sm text-muted-foreground whitespace-nowrap">min</span>
                        </div>
                      </Field>
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive self-end sm:self-auto"
                    onClick={() => remove(index)}
                  >
                    <Trash2 />
                    <span className="sr-only">Remove Set</span>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
          
          {fields.length === 0 && (
            <div className="text-center p-8 border rounded-lg border-dashed text-muted-foreground bg-muted/20">
              No sets added yet. Click &quot;Add Set&quot; to begin your workout.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isPending || fields.length === 0}>
          {isPending ? "Saving..." : "Save Workout"}
        </Button>
      </div>
    </form>
  )
}
