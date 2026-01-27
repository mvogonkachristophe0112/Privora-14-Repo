import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="empty-state flex flex-col items-center justify-center py-16 px-4">
      {icon && (
        <div className="empty-state-icon text-6xl mb-4 opacity-40">
          {icon}
        </div>
      )}
      <h3 className="empty-state-title text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="empty-state-description text-sm text-gray-600 mb-6 max-w-md text-center">
          {description}
        </p>
      )}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};
