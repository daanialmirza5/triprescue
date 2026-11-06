import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  label,
}) => {
  return (
    <div className={`inline-flex items-center gap-2 text-slate-400 ${className}`} role="status">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-emerald-400`} />
      {label ? (
        <span className="text-sm font-medium">{label}</span>
      ) : (
        <span className="sr-only">Loading...</span>
      )}
    </div>
  );
};

