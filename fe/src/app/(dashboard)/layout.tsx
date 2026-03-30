import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar/>
       <main className="flex-1 min-w-0 overflow-hidden">
          {/* <SidebarTrigger variant="ghost" className="absolute left-3 top-3"/> */}
          {children}
       </main>
      </SidebarProvider>
    </div>
  );
}
// <main className="flex-1 min-w-0 overflow-hidden">

// </main>
