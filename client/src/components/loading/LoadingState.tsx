import React from "react";
import {
  BaseLoadingProps,
  LoadingVariant,
  LoadingSize,
  LoadingPosition,
} from "../../types/loading";
import { SpinnerLoader } from "./SpinnerLoader";
import { SkeletonLoader } from "./SkeletonLoader";
import { DotsLoader } from "./DotsLoader";
import { PulseLoader } from "./PulseLoader";
import { ShimmerLoader } from "./ShimmerLoader";
import { InlineLoader } from "./InlineLoader";
import { OverlayLoader } from "./OverlayLoader";

/**
 * LoadingState Component
 * Usage Examples:
 *
 * // Simple spinner
 * <LoadingState isLoading={true} variant="spinner" />
 *
 * // Skeleton for product grid
 * <LoadingState isLoading={true} variant="skeleton" count={8} />
 *
 * // Inline loading with text
 * <LoadingState isLoading={true} variant="inline" text="Saving..." />
 *
 * // Full screen overlay
 * <LoadingState isLoading={true} variant="overlay" message="Processing your request..." />
 */
export const LoadingState: React.FC<BaseLoadingProps> = ({
  isLoading,
  variant = "spinner",
  size = "md",
  position = "center",
  message,
  className = "",
  showText = false,
  loadingText = "Loading...",
  color = "primary",
  ...props
}) => {
  if (!isLoading) {
    return null;
  }

  const commonProps = {
    isLoading: true,
    size,
    position,
    message: message || (showText ? loadingText : undefined),
    className,
    color,
    ...props,
  };

  const renderLoadingVariant = (variant: LoadingVariant) => {
    switch (variant) {
      case "spinner":
        return <SpinnerLoader {...commonProps} />;

      case "skeleton":
        return <SkeletonLoader {...commonProps} />;

      case "dots":
        return <DotsLoader {...commonProps} />;

      case "pulse":
        return <PulseLoader {...commonProps} />;

      case "shimmer":
        return <ShimmerLoader {...commonProps} />;

      case "inline":
        return <InlineLoader {...commonProps} />;

      case "overlay":
        return <OverlayLoader {...commonProps} />;

      default:
        console.warn(
          `Unknown loading variant: ${variant}. Falling back to spinner.`
        );
        return <SpinnerLoader {...commonProps} />;
    }
  };

  return (
    <div
      className={`loading-state loading-state--${variant} loading-state--${size} loading-state--${position} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message || loadingText}
    >
      {renderLoadingVariant(variant)}
    </div>
  );
};

export {
  SpinnerLoader,
  SkeletonLoader,
  DotsLoader,
  PulseLoader,
  ShimmerLoader,
  InlineLoader,
  OverlayLoader,
};

export type { BaseLoadingProps, LoadingVariant, LoadingSize, LoadingPosition };
