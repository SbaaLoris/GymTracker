import { Edit2, Trash2 } from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { BodyMetric } from "@/schemas"

interface BodyMetricTableProps {
  data: BodyMetric[]
  isLoading: boolean
  onEdit: (metric: BodyMetric) => void
  onDelete: (metric: BodyMetric) => void
}

export function BodyMetricTable({
  data,
  isLoading,
  onEdit,
  onDelete,
}: BodyMetricTableProps) {
  // Sort newest first for table listings
  const sortedEntries = [...data].sort((a, b) => b.date.localeCompare(a.date))

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString(undefined, { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Weight (kg)</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : sortedEntries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                No weight logs yet. Log your weight to get started.
              </TableCell>
            </TableRow>
          ) : (
            sortedEntries.map((metric) => (
              <TableRow key={metric.id}>
                <TableCell className="font-medium">
                  {formatDate(metric.date)}
                </TableCell>
                <TableCell>
                  {metric.body_weight.toFixed(1)} kg
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(metric)}
                    >
                      <Edit2 className="size-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(metric)}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
