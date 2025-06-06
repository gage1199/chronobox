import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  clickable = false,
  onClick
}) => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 shadow-sm';
  const interactiveClasses = hoverable || clickable 
    ? 'transition-shadow hover:shadow-md hover:border-gray-300' 
    : '';
  const clickableClasses = clickable 
    ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2' 
    : '';

  const classes = `${baseClasses} ${interactiveClasses} ${clickableClasses} ${className}`;

  if (clickable) {
    return (
      <div
        className={classes}
        onClick={onClick}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card; 