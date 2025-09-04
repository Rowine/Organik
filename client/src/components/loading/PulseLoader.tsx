import React from 'react';
import { BaseLoadingProps } from '../../types/loading';

export const PulseLoader: React.FC<BaseLoadingProps> = ({
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
      pulse: "w-4 h-4",
      text: "text-xs",
      container: "p-2"
    },
    sm: {
      pulse: "w-6 h-6",
      text: "text-sm",
      container: "p-3"
    },
    md: {
      pulse: "w-8 h-8",
      text: "text-base",
      container: "p-4"
    },
    lg: {
      pulse: "w-12 h-12",
      text: "text-lg",
      container: "p-6"
    },
    xl: {
      pulse: "w-16 h-16",
      text: "text-xl",
      container: "p-8"
    }
  };

  const colorConfig = {
    primary: "bg-green-600",
    secondary: "bg-gray-600",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    error: "bg-red-600",
    neutral: "bg-gray-500"
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
        <div className="relative">
          <div
            className={`
              ${currentSize.pulse} 
              ${currentColor} 
              rounded-full 
              animate-ping
              opacity-75
            `}
            role="img"
            aria-label="Pulsing loading indicator"
          />
          <div
            className={`
              ${currentSize.pulse} 
              ${currentColor} 
              rounded-full 
              absolute 
              top-0 
              left-0
              opacity-100
            `}
          />
        </div>

        {(showText || message) && (
          <p
            className={`${currentSize.text} ${currentColor.replace('bg-', 'text-')} font-medium text-center`}
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
