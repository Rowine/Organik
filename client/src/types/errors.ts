/**
 * Central Error Types for Organik App
 *
 * This file defines all error types used throughout the application
 * for consistent error handling and better type safety.
 */

// Base API Error interface
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  field?: string;
  timestamp?: string;
}

// Validation Error - for form validation and input errors
export interface ValidationError extends ApiError {
  field: string;
  value?: any;
  code: "VALIDATION_ERROR";
}

// Authentication Error - for login/auth related issues
export interface AuthError extends ApiError {
  code:
    | "UNAUTHORIZED"
    | "TOKEN_EXPIRED"
    | "INVALID_CREDENTIALS"
    | "ACCESS_FORBIDDEN";
}

// Network Error - for connection and server issues
export interface NetworkError extends ApiError {
  code: "NETWORK_ERROR" | "TIMEOUT" | "SERVER_ERROR" | "CONNECTION_FAILED";
  status: 500 | 502 | 503 | 504;
}

// Resource Error - for CRUD operation errors
export interface ResourceError extends ApiError {
  code: "NOT_FOUND" | "ALREADY_EXISTS" | "CONFLICT" | "FORBIDDEN";
  resourceType?: "product" | "user" | "order" | "cart" | "review";
  resourceId?: string;
}

// Payment Error - for payment processing issues
export interface PaymentError extends ApiError {
  code:
    | "PAYMENT_FAILED"
    | "INSUFFICIENT_FUNDS"
    | "INVALID_PAYMENT_METHOD"
    | "PAYMENT_DECLINED";
  paymentMethod?: string;
}

// Cart Error - for cart-specific issues
export interface CartError extends ApiError {
  code:
    | "ITEM_OUT_OF_STOCK"
    | "QUANTITY_EXCEEDED"
    | "CART_EMPTY"
    | "INVALID_QUANTITY";
  productId?: string;
  availableQuantity?: number;
}

// Generic Async State with proper error typing
export interface AsyncState<T> {
  data: T | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error?: ApiError;
  lastFetched?: number;
  isStale?: boolean;
}

// Union type of all possible errors
export type AppError =
  | ValidationError
  | AuthError
  | NetworkError
  | ResourceError
  | PaymentError
  | CartError
  | ApiError;

// Error severity levels
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

// Enhanced error with metadata
export interface EnhancedError extends ApiError {
  severity: ErrorSeverity;
  recoverable: boolean;
  userMessage?: string; // User-friendly message
  technicalMessage?: string; // Technical details for debugging
  action?: {
    label: string;
    handler: () => void;
  };
}

// Error categories for better organization
export const ERROR_CATEGORIES = {
  AUTHENTICATION: "authentication",
  VALIDATION: "validation",
  NETWORK: "network",
  RESOURCE: "resource",
  PAYMENT: "payment",
  CART: "cart",
  UNKNOWN: "unknown",
} as const;

export type ErrorCategory =
  (typeof ERROR_CATEGORIES)[keyof typeof ERROR_CATEGORIES];

// Common HTTP status codes
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// Type guard functions for error identification
export const isValidationError = (
  error: ApiError
): error is ValidationError => {
  return error.code === "VALIDATION_ERROR";
};

export const isAuthError = (error: ApiError): error is AuthError => {
  return [
    "UNAUTHORIZED",
    "TOKEN_EXPIRED",
    "INVALID_CREDENTIALS",
    "ACCESS_FORBIDDEN",
  ].includes(error.code || "");
};

export const isNetworkError = (error: ApiError): error is NetworkError => {
  return [
    "NETWORK_ERROR",
    "TIMEOUT",
    "SERVER_ERROR",
    "CONNECTION_FAILED",
  ].includes(error.code || "");
};

export const isResourceError = (error: ApiError): error is ResourceError => {
  return ["NOT_FOUND", "ALREADY_EXISTS", "CONFLICT", "FORBIDDEN"].includes(
    error.code || ""
  );
};

export const isPaymentError = (error: ApiError): error is PaymentError => {
  return [
    "PAYMENT_FAILED",
    "INSUFFICIENT_FUNDS",
    "INVALID_PAYMENT_METHOD",
    "PAYMENT_DECLINED",
  ].includes(error.code || "");
};

export const isCartError = (error: ApiError): error is CartError => {
  return [
    "ITEM_OUT_OF_STOCK",
    "QUANTITY_EXCEEDED",
    "CART_EMPTY",
    "INVALID_QUANTITY",
  ].includes(error.code || "");
};

// Helper function to categorize errors
export const getErrorCategory = (error: ApiError): ErrorCategory => {
  if (isAuthError(error)) return ERROR_CATEGORIES.AUTHENTICATION;
  if (isValidationError(error)) return ERROR_CATEGORIES.VALIDATION;
  if (isNetworkError(error)) return ERROR_CATEGORIES.NETWORK;
  if (isResourceError(error)) return ERROR_CATEGORIES.RESOURCE;
  if (isPaymentError(error)) return ERROR_CATEGORIES.PAYMENT;
  if (isCartError(error)) return ERROR_CATEGORIES.CART;
  return ERROR_CATEGORIES.UNKNOWN;
};

// Helper function to get user-friendly error messages
export const getUserFriendlyMessage = (error: ApiError): string => {
  switch (error.code) {
    case "UNAUTHORIZED":
      return "Please log in to continue";
    case "TOKEN_EXPIRED":
      return "Your session has expired. Please log in again";
    case "INVALID_CREDENTIALS":
      return "Invalid email or password";
    case "ACCESS_FORBIDDEN":
      return "You do not have permission to perform this action";
    case "NOT_FOUND":
      return "The requested item could not be found";
    case "ITEM_OUT_OF_STOCK":
      return "This item is currently out of stock";
    case "QUANTITY_EXCEEDED":
      return "The requested quantity exceeds available stock";
    case "NETWORK_ERROR":
      return "Please check your internet connection and try again";
    case "SERVER_ERROR":
      return "Something went wrong on our end. Please try again later";
    case "VALIDATION_ERROR":
      return error.message || "Please check your input and try again";
    default:
      return error.message || "An unexpected error occurred";
  }
};

// Helper function to determine if error is recoverable
export const isRecoverableError = (error: ApiError): boolean => {
  const recoverableCodes = [
    "NETWORK_ERROR",
    "TIMEOUT",
    "SERVER_ERROR",
    "TOKEN_EXPIRED",
    "VALIDATION_ERROR",
    "ITEM_OUT_OF_STOCK",
    "QUANTITY_EXCEEDED",
  ];

  return recoverableCodes.includes(error.code || "");
};

// Helper function to get error severity
export const getErrorSeverity = (error: ApiError): ErrorSeverity => {
  switch (error.code) {
    case "SERVER_ERROR":
    case "CONNECTION_FAILED":
      return "critical";
    case "UNAUTHORIZED":
    case "ACCESS_FORBIDDEN":
    case "PAYMENT_FAILED":
      return "high";
    case "NOT_FOUND":
    case "ITEM_OUT_OF_STOCK":
    case "NETWORK_ERROR":
      return "medium";
    case "VALIDATION_ERROR":
    case "INVALID_QUANTITY":
      return "low";
    default:
      return "medium";
  }
};
