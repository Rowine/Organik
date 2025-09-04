import React from "react";
import { SkeletonLoadingProps } from "../../types/loading";

export const ShimmerLoader: React.FC<SkeletonLoadingProps> = ({
  count = 1,
  height = "100px",
  width = "100%",
  rounded = true,
  animationSpeed = "normal",
  className = "",
  color = "neutral",
  size = "md",
  position = "center",
  message,
}) => {
  const animationSpeedConfig = {
    slow: "animate-shimmer-slow",
    normal: "animate-shimmer",
    fast: "animate-shimmer-fast",
  };

  const colorConfig = {
    primary: "bg-gradient-to-r from-green-200 via-green-100 to-green-200",
    secondary: "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200",
    success: "bg-gradient-to-r from-green-200 via-green-100 to-green-200",
    warning: "bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200",
    error: "bg-gradient-to-r from-red-200 via-red-100 to-red-200",
    neutral: "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200",
  };

  const sizeConfig = {
    xs: "h-4",
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
    xl: "h-16",
  };

  const positionConfig = {
    center: "flex items-center justify-center",
    top: "flex items-start justify-center",
    bottom: "flex items-end justify-center",
    left: "flex items-center justify-start",
    right: "flex items-center justify-end",
  };

  const currentAnimationSpeed = animationSpeedConfig[animationSpeed];
  const currentColor = colorConfig[color];
  const currentSize = sizeConfig[size];
  const currentPosition = positionConfig[position];

  // Generate shimmer items
  const shimmerItems = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`
        ${currentColor} 
        ${currentAnimationSpeed}
        ${rounded ? "rounded-lg" : ""}
        ${className}
        relative
        overflow-hidden
      `}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        width: typeof width === "number" ? `${width}px` : width,
        minHeight: currentSize,
      }}
      role="img"
      aria-label={`Shimmer loading placeholder ${index + 1}`}
    >
      {/* Shimmer overlay effect */}
      <div className="animate-shimmer-overlay absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  ));

  return (
    <div
      className={`shimmer-loader ${currentPosition} space-y-4`}
      role="status"
      aria-live="polite"
      aria-label={message || `Loading ${count} item${count !== 1 ? "s" : ""}`}
    >
      {shimmerItems}

      <span className="sr-only">
        {message || `Loading ${count} item${count !== 1 ? "s" : ""}`}
      </span>
    </div>
  );
};
