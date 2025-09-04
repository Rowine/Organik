/**
 * Loading State Types and Interfaces
 *
 * This file defines all the TypeScript interfaces and types for the loading system.
 */

export type LoadingState = "idle" | "pending" | "succeeded" | "failed";

export type LoadingVariant =
  | "spinner"
  | "skeleton"
  | "dots"
  | "pulse"
  | "shimmer"
  | "inline"
  | "overlay";

export type LoadingSize = "xs" | "sm" | "md" | "lg" | "xl";

export type LoadingPosition = "center" | "top" | "bottom" | "left" | "right";

export interface BaseLoadingProps {
  isLoading: boolean;
  variant?: LoadingVariant;
  size?: LoadingSize;
  position?: LoadingPosition;
  message?: string;
  className?: string;
  showText?: boolean;
  loadingText?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "neutral";
}

export interface SkeletonLoadingProps extends BaseLoadingProps {
  count?: number;
  height?: string | number;
  width?: string | number;
  rounded?: boolean;
  animationSpeed?: "slow" | "normal" | "fast";
}

export interface OverlayLoadingProps extends BaseLoadingProps {
  blur?: boolean;
  opacity?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export interface InlineLoadingProps extends BaseLoadingProps {
  text?: string;
  inline?: boolean;
}

export interface UseLoadingStateReturn {
  loading: LoadingState;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
  error?: string;
  setLoading: (state: LoadingState) => void;
  startLoading: () => void;
  stopLoading: () => void;
  stopLoadingWithError: (error: string) => void;
  resetLoading: () => void;
}

export interface LoadingConfig {
  defaultVariant: LoadingVariant;
  defaultSize: LoadingSize;
  defaultColor:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "neutral";
  defaultAnimationSpeed: "slow" | "normal" | "fast";
  showTextByDefault: boolean;
  defaultLoadingText: string;
}

export interface LoadingTheme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  neutral: string;
  overlayBackground: string;
  skeletonBackground: string;
  skeletonHighlight: string;
}

export interface LoadingSizeConfig {
  xs: { width: string; height: string; fontSize: string };
  sm: { width: string; height: string; fontSize: string };
  md: { width: string; height: string; fontSize: string };
  lg: { width: string; height: string; fontSize: string };
  xl: { width: string; height: string; fontSize: string };
}

export interface LoadingAnimationConfig {
  duration: {
    slow: string;
    normal: string;
    fast: string;
  };
  easing: {
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}
