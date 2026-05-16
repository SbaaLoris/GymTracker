import * as React from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { ExerciseList } from "@/components/exercises/ExerciseList"
import { ExerciseFormDialog } from "@/components/exercises/ExerciseFormDialog"
import { ExerciseRequestDialog } from "@/components/exercises/ExerciseRequestDialog"
import { useAuth } from "@/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function ExercisesPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isRequestOpen, setIsRequestOpen] = React.useState(false)

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exercises</h1>
            <p className="text-muted-foreground mt-1">
              Browse the master catalogue of exercises.
            </p>
          </div>
          <div>
            {isAdmin ? (
              <Button onClick={() => setIsFormOpen(true)}>
                <PlusIcon className="mr-2 h-4 w-4" /> Add Exercise
              </Button>
            ) : (
              <Button onClick={() => setIsRequestOpen(true)}>
                <PlusIcon className="mr-2 h-4 w-4" /> Request Exercise
              </Button>
            )}
          </div>
        </div>

        <ExerciseList />

        {isAdmin && (
          <ExerciseFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />
        )}

        {!isAdmin && (
          <ExerciseRequestDialog open={isRequestOpen} onOpenChange={setIsRequestOpen} />
        )}
      </div>
    </AppLayout>
  )
}
