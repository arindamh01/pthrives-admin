'use client';

import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface SideModalAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary';
  disabled?: boolean;
  loading?: boolean;
}

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showActions?: boolean;
  actions?: SideModalAction[];
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-full',
};

export function SideModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  side = 'right',
  size = 'lg',
  showActions = false,
  actions = [],
}: SideModalProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={side} className={`${sizeClasses[size]} flex flex-col p-0`}>
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="text-2xl">{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          {children}
        </ScrollArea>

        {showActions && actions.length > 0 && (
          <SheetFooter className="px-6 py-4 border-t bg-gray-50">
            <div className="flex gap-2 w-full sm:w-auto">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant === 'primary' ? 'default' : action.variant}
                  disabled={action.disabled || action.loading}
                  className={`flex-1 sm:flex-none ${
                    action.variant === 'primary'
                      ? 'bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700'
                      : ''
                  }`}
                >
                  {action.loading ? 'Loading...' : action.label}
                </Button>
              ))}
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

