import { AppSidebar } from "./AppSidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { PageTransition } from "./PageTransition"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 md:hidden">
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

