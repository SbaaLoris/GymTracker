import { useExercises } from '@/hooks/useExercises'
import { AppLayout } from "@/components/layout/AppLayout"
import { PageHeader } from "@/components/layout/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function ExercisesPage() {
  const { data, isLoading, error } = useExercises()

  if (error) {
    return (
      <AppLayout>
        <PageHeader title="Exercises" />
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          Error: {error.message}
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageHeader
        title="Exercises"
        description="Discover exercises for your workout."
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4 flex flex-col gap-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((ex) => (
            <Card key={ex.id} className="transition-colors hover:bg-muted/50">
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold leading-none">{ex.name}</h3>
                  <span className="text-[10px] font-mono text-muted-foreground">#{ex.id}</span>
                </div>
                <div>
                  <Badge variant="outline" className="text-[10px]">
                    {ex.muscle_group}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  )
}

export default ExercisesPage
