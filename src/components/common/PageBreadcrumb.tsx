"use client"

import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageBreadcrumbProps {
  pageTitle: string
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
  className?: string
}

export default function PageBreadcrumb({
  pageTitle,
  breadcrumbs = [],
  className
}: PageBreadcrumbProps) {
  return (
    <div className={cn("mb-6", className)}>
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Home className="h-4 w-4" />
        <ChevronRight className="h-4 w-4" />
        
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            {breadcrumb.href ? (
              <a
                href={breadcrumb.href}
                className="hover:text-primary transition-colors"
              >
                {breadcrumb.label}
              </a>
            ) : (
              <span>{breadcrumb.label}</span>
            )}
            <ChevronRight className="h-4 w-4" />
          </React.Fragment>
        ))}
        
        <span className="font-medium text-foreground bg-gradient-to-r from-pthrives-teal to-pthrives-green bg-clip-text text-transparent">
          {pageTitle}
        </span>
      </nav>
    </div>
  )
}
