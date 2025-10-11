'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary';
  disabled?: boolean;
  loading?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showActions?: boolean;
  actions?: ModalAction[];
  closeOnOverlayClick?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-6xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showActions = false,
  actions = [],
  closeOnOverlayClick = true,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={closeOnOverlayClick ? onClose : undefined}>
      <DialogContent className={`${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {showActions && actions.length > 0 && (
          <DialogFooter className="flex gap-2 sm:gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant === 'primary' ? 'default' : action.variant}
                disabled={action.disabled || action.loading}
                className={action.variant === 'primary' ? 'bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700' : ''}
              >
                {action.loading ? 'Loading...' : action.label}
              </Button>
            ))}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

