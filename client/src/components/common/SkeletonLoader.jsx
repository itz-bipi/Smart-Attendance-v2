import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const SkeletonLoader = ({
  count = 1,
  height = 'h-4',
  width = 'w-full',
  className = '',
  circle = false,
}) => {
  return (
    <div className="space-y-3 w-full animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={twMerge(
            clsx(
              'bg-slate-200/80',
              circle ? 'rounded-full' : 'rounded-xl',
              height,
              width,
              className
            )
          )}
        />
      ))}
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-pulse space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-5 bg-slate-200 rounded-lg w-1/3" />
      <div className="h-4 bg-slate-200 rounded-full w-12" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
      <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
    </div>
    <div className="pt-2 flex justify-between items-center border-t border-slate-50">
      <div className="h-4 bg-slate-200 rounded-lg w-20" />
      <div className="h-8 bg-slate-200 rounded-xl w-24" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-pulse space-y-4">
    <div className="h-6 bg-slate-200 rounded-lg w-1/4 mb-6" />
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4 py-3 border-b border-slate-100 last:border-0">
        {Array.from({ length: cols }).map((_, c) => (
          <div
            key={c}
            className="h-4 bg-slate-200 rounded-lg flex-1"
            style={{ width: `${100 / cols}%` }}
          />
        ))}
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
