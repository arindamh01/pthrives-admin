"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  GraduationCap, 
  BarChart3, 
  Settings,
  FolderOpen,
  MessageSquare,
  FileText,
  Award,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarHeader, SidebarTitle, SidebarFooter } from '@/components/ui/sidebar'
import { useSidebarStore } from '@/store/useStore'
import Image from 'next/image'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Courses',
    href: '/courses',
    icon: BookOpen,
  },
  {
    name: 'Categories',
    href: '/categories',
    icon: FolderOpen,
  },
  {
    name: 'Trainers',
    href: '/trainers',
    icon: GraduationCap,
  },
  {
    name: 'Students',
    href: '/students',
    icon: Users,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Certificates',
    href: '/certificates',
    icon: Award,
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebarStore()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar className={cn(
        "border-r transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <SidebarHeader className="px-3 py-4">
          <div className="flex items-center justify-between">
            {!isCollapsed ? (
              <div className="flex items-center space-x-2">
                <Image
                  src={isCollapsed ? "/assets/logos/Logo.png" : "/assets/logos/full-transparent-bg-h.png"}
                  alt="PThrives Logo"
                  width={isCollapsed ? 50 : 180}
                  height={isCollapsed ? 50 : 60}
                  className="rounded"
                />
                {/* <SidebarTitle className="text-lg font-bold bg-gradient-to-r from-pthrives-teal to-pthrives-green bg-clip-text text-transparent">
                  PThrives Admin
                </SidebarTitle> */}
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <Image
                  src="/assets/logos/Logo.png"
                  alt="PThrives Logo"
                  width={60}
                  height={60}
                  className="rounded"
                />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className={cn(
                "h-8 w-8 p-0 hover:bg-primary/10 transition-colors",
                isCollapsed ? "absolute top-4 right-2" : "ml-auto"
              )}
                >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="flex-1">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href} className="block">
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start relative transition-all duration-200 hover:bg-primary/5 group",
                      isActive && "bg-gradient-to-r from-pthrives-teal/10 to-pthrives-green/10 text-primary border-l-2 border-primary"
                    )}
                  >
                    <item.icon className={cn(
                      "h-4 w-4 transition-colors",
                      isCollapsed ? "mr-0" : "mr-2",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    )} />
                    {!isCollapsed && (
                      <span
                        className={cn(
                          "transition-all duration-200 relative",
                          "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-pthrives-teal after:to-pthrives-green after:transition-all after:duration-300",
                          "group-hover:after:w-full",
                          "group-hover:text-pthrives-teal"
                        )}
                        style={{
                          transition: "color 0.2s",
                        }}
                      >
                        {item.name}
                      </span>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </SidebarContent>
        
        <SidebarFooter className="p-3">
          <div className="flex justify-center">
            <Image
                  src={isCollapsed ? "/assets/logos/Logo.png" : "/assets/logos/full-transparent-bg-h.png"}
                  alt="PThrives Logo"
              width={isCollapsed ? 60 : 180}
              height={isCollapsed ? 60 : 60}
              className="rounded"
            />
          </div>
        </SidebarFooter>
      </Sidebar>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background/80 backdrop-blur-sm border-b px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-pthrives-teal to-pthrives-green bg-clip-text text-transparent">
                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="hover:bg-primary/5 hover:border-primary/20 transition-colors">
                Settings
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background to-muted/20">
          {children}
        </main>
      </div>
    </div>
  )
}
