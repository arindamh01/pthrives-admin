'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ClearFilterButtonProps {
  onClear: () => void;
  disabled?: boolean;
  label?: string;
}

export default function ClearFilterButton({
  onClear,
  disabled = false,
  label = 'Clear Filters',
}: ClearFilterButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClear}
      disabled={disabled}
      className="flex items-center gap-2"
    >
      <X className="h-4 w-4" />
      {label}
    </Button>
  );
}

