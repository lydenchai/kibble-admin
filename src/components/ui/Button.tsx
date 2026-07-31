"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "dark";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 border border-brand-500/30 active:scale-[0.98]",
  secondary:
    "bg-stone-100 hover:bg-stone-200/90 text-stone-800 border border-stone-200/80 shadow-2xs hover:shadow-xs active:scale-[0.98]",
  outline:
    "bg-white/90 hover:bg-stone-50 text-stone-700 border border-stone-300/80 shadow-2xs hover:border-stone-400 active:scale-[0.98]",
  ghost:
    "bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900 active:scale-[0.98]",
  danger:
    "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 border border-rose-500/30 active:scale-[0.98]",
  success:
    "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 border border-emerald-500/30 active:scale-[0.98]",
  dark:
    "bg-stone-900 hover:bg-stone-800 text-white shadow-md shadow-stone-900/20 hover:shadow-lg border border-stone-800 active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 text-xs gap-1 rounded-lg font-medium",
  sm: "px-3.5 py-1.5 text-xs gap-1.5 rounded-xl font-semibold",
  md: "px-4 py-2.5 text-sm gap-2 rounded-xl font-semibold",
  lg: "px-5.5 py-3 text-base gap-2.5 rounded-2xl font-bold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center transition-all duration-200 select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none";

    const computedClassName = [
      baseClasses,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={computedClassName}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 shrink-0 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}

        {children && <span>{children}</span>}

        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
