import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'default',
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-2xl border border-slate-100/80 shadow-sm shadow-slate-200/50 transition-all duration-200',
          hover && 'hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5',
          paddings[padding],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={twMerge(clsx('flex items-start justify-between mb-5 gap-4', className))}>
    <div>
      <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default Card;
