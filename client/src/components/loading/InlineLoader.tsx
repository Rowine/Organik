import React from "react";
import { InlineLoadingProps } from "../../types/loading";

export const InlineLoader: React.FC<InlineLoadingProps> = ({
  size = "sm",
  message,
  className = "",
  color = "primary",
  text,
  inline = true,
  showText = false,
  loadingText = "Loading...",
}) => {
  const sizeConfig = {
    xs: {
      spinner: "h-3 w-3",
      text: "text-xs",
      container: "p-1",
    },
    sm: {
      spinner: "h-4 w-4",
      text: "text-sm",
      container: "p-2",
    },
    md: {
      spinner: "h-5 w-5",
      text: "text-base",
      container: "p-2",
    },
    lg: {
      spinner: "h-6 w-6",
      text: "text-lg",
      container: "p-3",
    },
    xl: {
      spinner: "h-8 w-8",
      text: "text-xl",
      container: "p-4",
    },
  };

  const colorConfig = {
    primary: "text-green-600",
    secondary: "text-gray-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
    neutral: "text-gray-500",
  };

  const currentSize = sizeConfig[size];
  const currentColor = colorConfig[color];

  const displayText = text || message || (showText ? loadingText : undefined);

  return (
    <div
      className={`
        inline-loader 
        ${inline ? "inline-flex" : "flex"} 
        items-center 
        space-x-2 
        ${currentSize.container} 
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-label={displayText || "Loading"}
    >
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

      {displayText && (
        <span
          className={`${currentSize.text} ${currentColor} font-medium`}
          role="status"
          aria-live="polite"
        >
          {displayText}
        </span>
      )}

      <span className="sr-only">{displayText || "Loading"}</span>
    </div>
  );
};
