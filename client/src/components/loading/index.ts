/**
 * Loading Components Index
 *
 * Centralized exports for all loading components and types.
 */

// Main loading component
export { LoadingState } from "./LoadingState";

// Individual loading components
export { SpinnerLoader } from "./SpinnerLoader";
export { SkeletonLoader } from "./SkeletonLoader";
export { DotsLoader } from "./DotsLoader";
export { PulseLoader } from "./PulseLoader";
export { ShimmerLoader } from "./ShimmerLoader";
export { InlineLoader } from "./InlineLoader";
export { OverlayLoader } from "./OverlayLoader";

// Types
export type {
  BaseLoadingProps,
  SkeletonLoadingProps,
  OverlayLoadingProps,
  InlineLoadingProps,
  LoadingVariant,
  LoadingSize,
  LoadingPosition,
  LoadingState as LoadingStateType,
  UseLoadingStateReturn,
  LoadingConfig,
  LoadingTheme,
  LoadingSizeConfig,
  LoadingAnimationConfig,
} from "../../types/loading";
