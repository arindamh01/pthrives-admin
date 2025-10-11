'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ReactNode } from 'react';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ListCardProps {
  heading: string;
  description?: string;
  icon?: IconDefinition;
  addButton?: boolean;
  addButtonLabel?: string;
  onButtonClick?: () => void;
  children: ReactNode;
  actions?: ReactNode;
}

export default function ListCard({
  heading,
  description,
  icon,
  addButton = false,
  addButtonLabel = 'Add New',
  onButtonClick,
  children,
  actions,
}: ListCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg">
                <FontAwesomeIcon icon={icon} className="h-5 w-5 text-white" />
              </div>
            )}
            <div>
              <CardTitle className="text-2xl">{heading}</CardTitle>
              {description && <CardDescription className="mt-1">{description}</CardDescription>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            {addButton && (
              <Button
                onClick={onButtonClick}
                className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {addButtonLabel}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
