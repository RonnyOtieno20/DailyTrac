
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BarChartBig, LayoutDashboard, Info, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";
import Link from "next/link";


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
       <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 fill-primary">
                    <title>DailyTrac</title>
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1-16h2v7h-2zm0 8h2v2h-2z M7.5 10.5h2v2h-2zm9 0h2v2h-2z M10.5 7.5h2v2h-2zm0 9h2v2h-2z"/>
                </svg>
                <h1 className="text-2xl font-bold text-primary">DailyTrac</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <SidebarMenuButton isActive={pathname.startsWith('/dashboard')}>
                    <LayoutDashboard />
                    <span>Daily Log</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/trends" legacyBehavior passHref>
                  <SidebarMenuButton isActive={pathname.startsWith('/trends')}>
                    <BarChartBig />
                    <span>Trends</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col">
            <header className="p-4 shadow-md bg-card flex items-center justify-between md:hidden">
              <SidebarTrigger />
              <ThemeToggle />
            </header>
            <SidebarInset>
                {children}
            </SidebarInset>
        </div>
    </div>
  );
}
