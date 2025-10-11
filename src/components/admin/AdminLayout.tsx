'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Menu,
  X,
  Settings,
  Database,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface NavItem {
  name: string
  href?: string
  icon: any
  children?: {
    name: string
    href: string
  }[]
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Leads',
    href: '/admin/leads',
    icon: Users,
  },
  {
    name: 'Courses',
    href: '/admin/courses',
    icon: BookOpen,
  },
  {
    name: 'Masters',
    icon: Database,
    children: [
      {
        name: 'Course Types',
        href: '/admin/masters/course-types',
      },
      {
        name: 'Course Categories',
        href: '/admin/masters/course-categories',
      },
      {
        name: 'Topics',
        href: '/admin/masters/topics',
      },
    ],
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([])
  const pathname = usePathname()

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenus(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-in-out",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/assets/logos/full-transparent-bg-h.png"
                alt="PThrives"
                width={220}
                height={42}
                className="h-8 w-auto"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              if (item.children) {
                const isOpen = openSubmenus.includes(item.name)
                const isAnyChildActive = item.children.some(child => pathname === child.href)
                
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={cn(
                        "w-full group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-sm",
                        isAnyChildActive
                          ? "bg-gradient-to-r from-teal-100 to-green-100 text-teal-700 border-l-4 border-teal-500 shadow-sm"
                          : "text-gray-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-green-50 hover:text-teal-700"
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-5 w-5 transition-all duration-200 group-hover:scale-110" />
                        {item.name}
                      </div>
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    {isOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                "block px-3 py-2 text-sm rounded-lg transition-all duration-200",
                                isChildActive
                                  ? "bg-teal-50 text-teal-700 font-medium"
                                  : "text-gray-600 hover:bg-teal-50 hover:text-teal-700"
                              )}
                              onClick={() => setSidebarOpen(false)}
                            >
                              {child.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-sm",
                    isActive
                      ? "bg-gradient-to-r from-teal-100 to-green-100 text-teal-700 border-l-4 border-teal-500 shadow-sm"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-green-50 hover:text-teal-700"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5 transition-all duration-200 group-hover:scale-110" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
    <div className={cn(
      "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ease-in-out",
      sidebarCollapsed ? "lg:w-16" : "lg:w-64"
    )}>
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <div className={cn(
            "flex h-16 items-center px-4 transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "justify-center" : "justify-between"
          )}>
            {sidebarCollapsed ? (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="hover:bg-teal-50 hover:scale-105 rounded-lg p-2 transition-all duration-200 ease-in-out"
                title="Expand sidebar"
              >
                <Image
                  src="/assets/logos/Logo.png"
                  alt="PThrives"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain transition-transform duration-200 hover:scale-110"
                  priority
                />
              </button>
            ) : (
              <>
                <div className="flex items-center space-x-3 transition-all duration-300 ease-in-out">
                  <Image
                    src="/assets/logos/full-transparent-bg-h.png"
                    alt="PThrives"
                    width={120}
                    height={32}
                    className="h-8 w-auto transition-transform duration-200 hover:scale-105"
                  />
                </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex hover:bg-teal-50 hover:text-teal-600 transition-all duration-200 rounded-lg p-2"
                title="Collapse sidebar"
              >
                <svg 
                  className="h-4 w-4 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7" 
                  />
                </svg>
              </Button>
              </>
            )}
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 transition-all duration-300 ease-in-out">
            {navigation.map((item) => {
              if (item.children) {
                const isOpen = openSubmenus.includes(item.name)
                const isAnyChildActive = item.children.some(child => pathname === child.href)
                
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => !sidebarCollapsed && toggleSubmenu(item.name)}
                      className={cn(
                        "w-full group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-sm",
                        isAnyChildActive
                          ? "bg-gradient-to-r from-teal-100 to-green-100 text-teal-700 border-l-4 border-teal-500 shadow-sm"
                          : "text-gray-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-green-50 hover:text-teal-700",
                        sidebarCollapsed && "justify-center"
                      )}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <div className="flex items-center">
                        <item.icon className={cn("h-5 w-5 transition-all duration-200 group-hover:scale-110", !sidebarCollapsed && "mr-3")} />
                        {!sidebarCollapsed && item.name}
                      </div>
                      {!sidebarCollapsed && (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </button>
                    {isOpen && !sidebarCollapsed && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                "block px-3 py-2 text-sm rounded-lg transition-all duration-200",
                                isChildActive
                                  ? "bg-teal-50 text-teal-700 font-medium"
                                  : "text-gray-600 hover:bg-teal-50 hover:text-teal-700"
                              )}
                            >
                              {child.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-sm",
                    isActive
                      ? "bg-gradient-to-r from-teal-100 to-green-100 text-teal-700 border-l-4 border-teal-500 shadow-sm"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-green-50 hover:text-teal-700",
                    sidebarCollapsed && "justify-center"
                  )}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon className={cn("h-5 w-5 transition-all duration-200 group-hover:scale-110", !sidebarCollapsed && "mr-3")} />
                  {!sidebarCollapsed && item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
      )}>
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {sidebarCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex hover:bg-teal-50 hover:text-teal-600 transition-all duration-200 rounded-lg p-2"
              onClick={() => setSidebarCollapsed(false)}
              title="Expand sidebar"
            >
              <svg 
                className="h-5 w-5 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 5l7 7-7 7M5 5l7 7-7 7" 
                />
              </svg>
            </Button>
          )}
          
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
