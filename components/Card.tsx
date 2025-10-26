import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  headerActions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', icon, headerActions }) => {
  return (
    <div className={`bg-brand-surface/80 dark:bg-brand-surface-dark/70 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200/30 dark:border-white/10 p-6 ${className}`}>
      <div className="flex justify-between items-center gap-3 mb-4">
        <div className="flex items-center gap-3">
          {icon && <div className="text-brand-primary text-xl w-6 h-6 flex items-center justify-center">{icon}</div>}
          <h3 className="text-lg font-bold text-brand-text dark:text-brand-text-dark">{title}</h3>
        </div>
        {headerActions && <div>{headerActions}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Card;