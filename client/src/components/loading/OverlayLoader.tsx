import React, { useEffect } from "react";
import { OverlayLoadingProps, LoadingSize } from "../../types/loading";

export const OverlayLoader: React.FC<OverlayLoadingProps> = ({
  size = "lg",
  message,
  className = "",
  color = "primary",
  blur = true,
  opacity = 0.8,
  dismissible = false,
  onDismiss,
  showText = true,
  loadingText = "Loading...",
}) => {
  const sizeConfig = {
    xs: {
      spinner: "h-6 w-6",
      text: "text-sm",
      container: "p-4",
    },
    sm: {
      spinner: "h-8 w-8",
      text: "text-base",
      container: "p-6",
    },
    md: {
      spinner: "h-12 w-12",
      text: "text-lg",
      container: "p-8",
    },
    lg: {
      spinner: "h-16 w-16",
      text: "text-xl",
      container: "p-10",
    },
    xl: {
      spinner: "h-20 w-20",
      text: "text-2xl",
      container: "p-12",
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

  // Handle escape key for dismissible overlays
  useEffect(() => {
    if (!dismissible || !onDismiss) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [dismissible, onDismiss]);

  // Handle click outside for dismissible overlays
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (dismissible && onDismiss && event.target === event.currentTarget) {
      onDismiss();
    }
  };

  return (
    <div
      className={`
        fixed 
        inset-0 
        z-50 
        flex 
        items-center 
        justify-center
        ${blur ? "backdrop-blur-sm" : ""}
        ${className}
      `}
      style={{
        backgroundColor: `rgba(0, 0, 0, ${opacity})`,
      }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
      aria-describedby="loading-description"
    >
      <div
        className={`
          rounded-2xl 
          bg-white 
          shadow-2xl 
          ${currentSize.container}
          mx-4 
          flex 
          max-w-sm 
          flex-col
          items-center 
          space-y-4
          ${dismissible ? "cursor-pointer" : ""}
        `}
        onClick={(e) => e.stopPropagation()}
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

        {(showText || message) && (
          <div className="text-center">
            <h3
              id="loading-title"
              className={`${currentSize.text} ${currentColor} mb-2 font-semibold`}
            >
              {message || loadingText}
            </h3>
            {dismissible && (
              <p id="loading-description" className="text-sm text-gray-500">
                Press ESC or click outside to cancel
              </p>
            )}
          </div>
        )}

        <span className="sr-only">{message || loadingText}</span>
      </div>
    </div>
  );
};
