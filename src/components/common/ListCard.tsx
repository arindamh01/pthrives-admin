"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ListCardProps {
  heading: string
  icon?: React.ReactNode
  addButton?: boolean
  onButtonClick?: () => void
  children: React.ReactNode
  className?: string
}

export default function ListCard({
  heading,
  icon,
  addButton = false,
  onButtonClick,
  children,
  className
}: ListCardProps) {
  return (
    <Card className={cn(
      "border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-lg",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="p-2 rounded-lg bg-primary/10">
                {icon}
              </div>
            )}
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-pthrives-teal to-pthrives-green bg-clip-text text-transparent">
              {heading}
            </CardTitle>
          </div>
          {addButton && (
            <Button
              onClick={onButtonClick}
              className="bg-gradient-to-r from-pthrives-teal to-pthrives-green hover:from-pthrives-teal/90 hover:to-pthrives-green/90 shadow-lg hover:shadow-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
