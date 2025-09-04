import React from 'react';
import { SkeletonLoadingProps } from '../../types/loading';

/**
 * SkeletonLoader Component
 * 
 * A flexible skeleton loading component that can be used for any content type.
 * 
 * Usage Examples:
 * 
 * // Product grid skeleton
 * <SkeletonLoader count={8} height="300px" width="250px" />
 * 
 * // List skeleton
 * <SkeletonLoader count={5} height="60px" width="100%" />
 * 
 * // Card skeleton
 * <SkeletonLoader count={1} height="200px" width="300px" rounded />
 */
export const SkeletonLoader: React.FC<SkeletonLoadingProps> = ({
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
    slow: "animate-pulse-slow",
    normal: "animate-pulse",
    fast: "animate-pulse-fast"
  };

  const colorConfig = {
    primary: "bg-green-200",
    secondary: "bg-gray-200",
    success: "bg-green-200",
    warning: "bg-yellow-200",
    error: "bg-red-200",
    neutral: "bg-gray-200"
  };


  const sizeConfig = {
    xs: "h-4",
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
    xl: "h-16"
  };


  const positionConfig = {
    center: "flex items-center justify-center",
    top: "flex items-start justify-center",
    bottom: "flex items-end justify-center",
    left: "flex items-center justify-start",
    right: "flex items-center justify-end"
  };

  const currentAnimationSpeed = animationSpeedConfig[animationSpeed];
  const currentColor = colorConfig[color];
  const currentSize = sizeConfig[size];
  const currentPosition = positionConfig[position];

  // Generate skeleton items
  const skeletonItems = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`
        ${currentColor} 
        ${currentAnimationSpeed}
        ${rounded ? 'rounded-lg' : ''}
        ${className}
      `}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
        minHeight: currentSize
      }}
      role="img"
      aria-label={`Loading placeholder ${index + 1}`}
    />
  ));

  return (
    <div
      className={`skeleton-loader ${currentPosition} space-y-4`}
      role="status"
      aria-live="polite"
      aria-label={message || `Loading ${count} item${count !== 1 ? 's' : ''}`}
    >
      {skeletonItems}

      <span className="sr-only">
        {message || `Loading ${count} item${count !== 1 ? 's' : ''}`}
      </span>
    </div>
  );
};
