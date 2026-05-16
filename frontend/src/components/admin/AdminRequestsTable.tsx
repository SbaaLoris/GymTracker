import * as React from "react"
import { 
  useExerciseRequests, 
  useApproveExerciseRequest, 
  useDenyExerciseRequest, 
  useDeleteExerciseRequest 
} from "@/hooks/useExerciseRequests"
import type { ExerciseRequest, RequestStatus } from "@/schemas"
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Check, X, Trash2, HeartPulse, Inbox } from "lucide-react"

export function AdminRequestsTable() {
  const [activeTab, setActiveTab] = React.useState<string>("pending")
  
  // Queries
  const { data: requests, isLoading, error, refetch } = useExerciseRequests(
    activeTab === "all" ? undefined : activeTab
  )

  // Mutations
  const { mutateAsync: approveRequest, isPending: isApproving } = useApproveExerciseRequest()
  const { mutateAsync: denyRequest, isPending: isDenying } = useDenyExerciseRequest()
  const { mutateAsync: deleteRequest, isPending: isDeleting } = useDeleteExerciseRequest()

  // Modal / Confirm state
  const [selectedRequest, setSelectedRequest] = React.useState<ExerciseRequest | null>(null)
  const [confirmAction, setConfirmAction] = React.useState<"approve" | "deny" | "delete" | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)

  const handleActionClick = (request: ExerciseRequest, action: "approve" | "deny" | "delete") => {
    setSelectedRequest(request)
    setConfirmAction(action)
    setIsConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!selectedRequest || !confirmAction) return

    try {
      if (confirmAction === "approve") {
        await approveRequest(selectedRequest.id)
        toast.success(`Request for "${selectedRequest.suggested_name}" approved and added to catalog!`)
      } else if (confirmAction === "deny") {
        await denyRequest(selectedRequest.id)
        toast.success(`Request for "${selectedRequest.suggested_name}" has been denied.`)
      } else if (confirmAction === "delete") {
        await deleteRequest(selectedRequest.id)
        toast.success("Request deleted successfully.")
      }
      refetch()
    } catch (err) {
      const errorMsg = (err as Error).message || `Failed to ${confirmAction} request.`
      toast.error(errorMsg)
    } finally {
      setIsConfirmOpen(false)
      setSelectedRequest(null)
      setConfirmAction(null)
    }
  }

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning/20 text-warning border-warning/30 font-semibold">Pending</Badge>
      case "approved":
        return <Badge className="bg-success/20 text-success border-success/30 font-semibold">Approved</Badge>
      case "denied":
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30 font-semibold">Denied</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center">
        <p className="text-destructive font-semibold">Failed to load exercise requests</p>
        <p className="text-muted-foreground text-sm mt-1">{(error as Error).message}</p>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex gap-1">
          <TabsTrigger value="pending" className="flex items-center gap-1.5">
            Pending
            {requests && activeTab === "pending" && requests.length > 0 && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-warning-foreground">
                {requests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="denied">Denied</TabsTrigger>
          <TabsTrigger value="all">All Logs</TabsTrigger>
        </TabsList>

        <div className="mt-4 rounded-xl border bg-card shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex flex-col gap-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !requests || requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-muted p-4 text-muted-foreground mb-4">
                <Inbox className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg">No requests found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mt-1">
                There are no custom exercise requests matching this filter status.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/40">
                    <TableHead className="w-[40px] pl-4">ID</TableHead>
                    <TableHead className="font-semibold">Suggested Name</TableHead>
                    <TableHead className="font-semibold">Muscle Group</TableHead>
                    <TableHead className="font-semibold text-center w-[100px]">Cardio?</TableHead>
                    <TableHead className="font-semibold w-[120px]">User ID</TableHead>
                    <TableHead className="font-semibold w-[120px]">Status</TableHead>
                    <TableHead className="font-semibold text-right pr-4 w-[160px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-xs text-muted-foreground pl-4">
                        {request.id}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {request.suggested_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {request.muscle_group}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {request.is_cardio ? (
                          <Badge variant="outline" className="inline-flex items-center gap-1 border-primary/20 bg-primary/5 text-primary">
                            <HeartPulse className="h-3 w-3" />
                            Cardio
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        User #{request.user_id}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {request.status === "pending" ? (
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              onClick={() => handleActionClick(request, "approve")}
                              variant="ghost"
                              size="icon"
                              disabled={isApproving || isDenying || isDeleting}
                              className="size-8 text-success hover:text-success hover:bg-success/15 rounded-lg"
                              title="Approve Request"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleActionClick(request, "deny")}
                              variant="ghost"
                              size="icon"
                              disabled={isApproving || isDenying || isDeleting}
                              className="size-8 text-destructive hover:text-destructive hover:bg-destructive/15 rounded-lg"
                              title="Deny Request"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleActionClick(request, "delete")}
                              variant="ghost"
                              size="icon"
                              disabled={isApproving || isDenying || isDeleting}
                              className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                              title="Delete Request"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Archived</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Tabs>

      {/* Confirmation Modal */}
      {selectedRequest && confirmAction && (
        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title={
            confirmAction === "approve" 
              ? "Approve Exercise Request" 
              : confirmAction === "deny" 
              ? "Deny Exercise Request" 
              : "Delete Exercise Request"
          }
          description={
            confirmAction === "approve"
              ? `Are you sure you want to approve "${selectedRequest.suggested_name}"? This will automatically create and publish this exercise as a global template for all users.`
              : confirmAction === "deny"
              ? `Are you sure you want to deny "${selectedRequest.suggested_name}"? This request status will be updated to "denied".`
              : `Are you sure you want to delete this request for "${selectedRequest.suggested_name}"? This action is permanent.`
          }
          confirmText={
            confirmAction === "approve" 
              ? "Approve & Publish" 
              : confirmAction === "deny" 
              ? "Deny Request" 
              : "Delete Permanently"
          }
          variant={confirmAction === "approve" ? "default" : "destructive"}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}
