// components/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
};

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};