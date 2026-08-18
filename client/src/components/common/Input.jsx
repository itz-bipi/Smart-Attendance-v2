import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = React.forwardRef(
  (
    {
      label,
      type = 'text',
      error,
      helperText,
      icon: Icon,
      className = '',
      id,
      name,
      required,
      options, // for select type
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const isPassword = type === 'password';
    const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
          >
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative rounded-xl shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="w-4 h-4" />
            </div>
          )}

          {type === 'select' ? (
            <select
              id={inputId}
              name={name}
              ref={ref}
              required={required}
              className={twMerge(
                clsx(
                  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors duration-150 focus:outline-none focus:ring-2 appearance-none cursor-pointer',
                  Icon && 'pl-10',
                  error
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100',
                  className
                )
              )}
              {...props}
            >
              {options ? (
                options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              ) : (
                props.children
              )}
            </select>
          ) : (
            <input
              id={inputId}
              name={name}
              ref={ref}
              type={currentType}
              required={required}
              className={twMerge(
                clsx(
                  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:outline-none focus:ring-2',
                  Icon && 'pl-10',
                  isPassword && 'pr-10',
                  error
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100',
                  className
                )
              )}
              {...props}
            />
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
