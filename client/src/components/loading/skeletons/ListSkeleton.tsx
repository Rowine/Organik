import React from "react";
import { SkeletonLoader } from "../SkeletonLoader";

interface ListSkeletonProps {
  count?: number;
  itemHeight?: string | number;
  showAvatar?: boolean;
  showSecondary?: boolean;
  showActions?: boolean;
  className?: string;
  animationSpeed?: "slow" | "normal" | "fast";
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  count = 5,
  itemHeight = "80px",
  showAvatar = true,
  showSecondary = true,
  showActions = true,
  className = "",
  animationSpeed = "normal",
}) => {
  return (
    <div
      className={`space-y-4 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${count} items`}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          style={{
            minHeight:
              typeof itemHeight === "number" ? `${itemHeight}px` : itemHeight,
          }}
          role="img"
          aria-label={`Loading item ${index + 1}`}
        >
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            {showAvatar && (
              <SkeletonLoader
                isLoading={true}
                count={1}
                height="48px"
                width="48px"
                rounded={true}
                animationSpeed={animationSpeed}
              />
            )}

            {/* Content */}
            <div className="min-w-0 flex-1">
              {/* Primary text */}
              <SkeletonLoader
                isLoading={true}
                count={1}
                height="20px"
                width="60%"
                rounded={true}
                animationSpeed={animationSpeed}
                className="mb-2"
              />

              {/* Secondary text */}
              {showSecondary && (
                <SkeletonLoader
                  isLoading={true}
                  count={1}
                  height="16px"
                  width="40%"
                  rounded={true}
                  animationSpeed={animationSpeed}
                />
              )}
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex space-x-2">
                <SkeletonLoader
                  isLoading={true}
                  count={1}
                  height="32px"
                  width="32px"
                  rounded={true}
                  animationSpeed={animationSpeed}
                />
                <SkeletonLoader
                  isLoading={true}
                  count={1}
                  height="32px"
                  width="32px"
                  rounded={true}
                  animationSpeed={animationSpeed}
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Screen reader only text for accessibility */}
      <span className="sr-only">Loading {count} items</span>
    </div>
  );
};
