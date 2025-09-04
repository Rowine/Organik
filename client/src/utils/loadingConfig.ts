import {
  LoadingConfig,
  LoadingTheme,
  LoadingSizeConfig,
  LoadingAnimationConfig,
} from "../types/loading";

/**
 * Loading Configuration
 *
 * Centralized configuration for all loading components.
 * This follows the Configuration Object pattern and provides
 * a single source of truth for loading component behavior.
 *
 */

export const defaultLoadingConfig: LoadingConfig = {
  defaultVariant: "spinner",
  defaultSize: "md",
  defaultColor: "primary",
  defaultAnimationSpeed: "normal",
  showTextByDefault: false,
  defaultLoadingText: "Loading...",
};

export const loadingTheme: LoadingTheme = {
  primary: "#10b981", // green-500
  secondary: "#6b7280", // gray-500
  success: "#10b981", // green-500
  warning: "#f59e0b", // amber-500
  error: "#ef4444", // red-500
  neutral: "#9ca3af", // gray-400
  overlayBackground: "rgba(0, 0, 0, 0.8)",
  skeletonBackground: "#e5e7eb", // gray-200
  skeletonHighlight: "#f3f4f6", // gray-100
};

export const loadingSizeConfig: LoadingSizeConfig = {
  xs: {
    width: "1rem",
    height: "1rem",
    fontSize: "0.75rem", // text-xs
  },
  sm: {
    width: "1.5rem",
    height: "1.5rem",
    fontSize: "0.875rem", // text-sm
  },
  md: {
    width: "2rem",
    height: "2rem",
    fontSize: "1rem", // text-base
  },
  lg: {
    width: "3rem",
    height: "3rem",
    fontSize: "1.125rem", // text-lg
  },
  xl: {
    width: "4rem",
    height: "4rem",
    fontSize: "1.25rem", // text-xl
  },
};

export const loadingAnimationConfig: LoadingAnimationConfig = {
  duration: {
    slow: "1.5s",
    normal: "1s",
    fast: "0.5s",
  },
  easing: {
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
};

/**
 * Loading Utility Functions
 *
 * Helper functions for working with loading states and configurations.
 */

/**
 * Get loading configuration with overrides
 */
export const getLoadingConfig = (
  overrides: Partial<LoadingConfig> = {}
): LoadingConfig => {
  return {
    ...defaultLoadingConfig,
    ...overrides,
  };
};

/**
 * Get loading theme with overrides
 */
export const getLoadingTheme = (
  overrides: Partial<LoadingTheme> = {}
): LoadingTheme => {
  return {
    ...loadingTheme,
    ...overrides,
  };
};

/**
 * Get size configuration for a specific size
 */
export const getSizeConfig = (size: keyof LoadingSizeConfig) => {
  return loadingSizeConfig[size];
};

/**
 * Get animation configuration for a specific speed
 */
export const getAnimationConfig = (
  speed: keyof LoadingAnimationConfig["duration"]
) => {
  return {
    duration: loadingAnimationConfig.duration[speed],
    easing: loadingAnimationConfig.easing.easeInOut,
  };
};

/**
 * Generate CSS custom properties for loading theme
 */
export const generateLoadingCSSVariables = (
  theme: LoadingTheme = loadingTheme
): string => {
  return `
    --loading-primary: ${theme.primary};
    --loading-secondary: ${theme.secondary};
    --loading-success: ${theme.success};
    --loading-warning: ${theme.warning};
    --loading-error: ${theme.error};
    --loading-neutral: ${theme.neutral};
    --loading-overlay-background: ${theme.overlayBackground};
    --loading-skeleton-background: ${theme.skeletonBackground};
    --loading-skeleton-highlight: ${theme.skeletonHighlight};
  `;
};

/**
 * Loading State Utilities
 */

/**
 * Check if a loading state indicates loading
 */
export const isLoading = (state: string): boolean => {
  return state === "pending";
};

/**
 * Check if a loading state indicates success
 */
export const isSuccess = (state: string): boolean => {
  return state === "succeeded";
};

/**
 * Check if a loading state indicates error
 */
export const isError = (state: string): boolean => {
  return state === "failed";
};

/**
 * Check if a loading state is idle
 */
export const isIdle = (state: string): boolean => {
  return state === "idle";
};

/**
 * Get user-friendly loading message based on context
 */
export const getLoadingMessage = (
  context: string,
  variant?: string
): string => {
  const messages: Record<string, string> = {
    products: "Loading products...",
    product: "Loading product details...",
    category: "Loading category...",
    user: "Loading user information...",
    order: "Loading order details...",
    cart: "Updating cart...",
    payment: "Processing payment...",
    review: "Submitting review...",
    profile: "Updating profile...",
    default: "Loading...",
  };

  return messages[context] || messages.default;
};

/**
 * Get appropriate loading variant based on context
 */
export const getLoadingVariant = (context: string): string => {
  const variants: Record<string, string> = {
    products: "skeleton",
    product: "skeleton",
    category: "skeleton",
    user: "spinner",
    order: "spinner",
    cart: "inline",
    payment: "overlay",
    review: "inline",
    profile: "spinner",
    default: "spinner",
  };

  return variants[context] || variants.default;
};
