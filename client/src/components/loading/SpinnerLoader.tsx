import React from 'react';
import { BaseLoadingProps } from '../../types/loading';

export const SpinnerLoader: React.FC<BaseLoadingProps> = ({
  size = "md",
  position = "center",
  message,
  className = "",
  color = "primary",
  showText = false,
  loadingText = "Loading...",
}) => {
  const sizeConfig = {
    xs: {
      spinner: "h-4 w-4",
      text: "text-xs",
      container: "p-2"
    },
    sm: {
      spinner: "h-6 w-6",
      text: "text-sm",
      container: "p-3"
    },
    md: {
      spinner: "h-8 w-8",
      text: "text-base",
      container: "p-4"
    },
    lg: {
      spinner: "h-12 w-12",
      text: "text-lg",
      container: "p-6"
    },
    xl: {
      spinner: "h-16 w-16",
      text: "text-xl",
      container: "p-8"
    }
  };

  const colorConfig = {
    primary: "text-green-600",
    secondary: "text-gray-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
    neutral: "text-gray-500"
  };

  const positionConfig = {
    center: "flex items-center justify-center",
    top: "flex items-start justify-center",
    bottom: "flex items-end justify-center",
    left: "flex items-center justify-start",
    right: "flex items-center justify-end"
  };

  const currentSize = sizeConfig[size];
  const currentColor = colorConfig[color];
  const currentPosition = positionConfig[position];

  return (
    <div className={`${currentPosition} ${currentSize.container} ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <svg
          className={`${currentSize.spinner} ${currentColor} animate-spin`}
          fill="none"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Loading spinner"
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

        {(showText || message) && (
          <p
            className={`${currentSize.text} ${currentColor} font-medium text-center`}
            role="status"
            aria-live="polite"
          >
            {message || loadingText}
          </p>
        )}

        <span className="sr-only">
          {message || loadingText}
        </span>
      </div>
    </div>
  );
};
