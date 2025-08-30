import {
  ApiError,
  AuthError,
  ValidationError,
  NetworkError,
  ResourceError,
  PaymentError,
  CartError,
} from "../types/errors";

type ErrorType =
  | ApiError
  | AuthError
  | ValidationError
  | NetworkError
  | ResourceError
  | PaymentError
  | CartError;

const ERROR_MESSAGES: Record<string, string> = {
  // Auth errors
  "auth/invalid-credentials": "Invalid email or password. Please try again.",
  "auth/user-not-found": "Account not found. Please check your credentials.",
  "auth/email-already-exists": "An account with this email already exists.",

  // Resource errors
  "resource/not-found": "The requested resource could not be found.",
  "resource/already-exists": "This resource already exists.",

  // Validation errors
  "validation/invalid-input": "Please check your input and try again.",
  "validation/required-field": "Please fill in all required fields.",

  // Network errors
  "network/offline": "You appear to be offline. Please check your connection.",
  "network/timeout": "The request timed out. Please try again.",

  // Payment errors
  "payment/insufficient-funds":
    "Insufficient funds. Please try a different payment method.",
  "payment/card-declined":
    "Your card was declined. Please try a different card.",

  // Cart errors
  "cart/out-of-stock": "Some items in your cart are out of stock.",
  "cart/quantity-exceeded": "The requested quantity exceeds available stock.",

  // Default error
  default: "An unexpected error occurred. Please try again later.",
};

export const getUserFriendlyMessage = (error: ErrorType): string => {
  if (!error) return ERROR_MESSAGES.default;

  // If we have a specific message for this error code, use it
  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }

  // If we have a message from the server, use it
  if (error.message) {
    return error.message;
  }

  // Fallback to default error message
  return ERROR_MESSAGES.default;
};

export const isRetryableError = (error: ErrorType): boolean => {
  if (!error) return false;

  // Network errors are usually retryable
  if (error.code?.startsWith("network/")) return true;

  // Resource not found errors are not retryable
  if (error.code === "resource/not-found") return false;

  // Validation errors are not retryable
  if (error.code?.startsWith("validation/")) return false;

  // Auth errors are not retryable
  if (error.code?.startsWith("auth/")) return false;

  // Payment errors might be retryable
  if (error.code?.startsWith("payment/")) return true;

  // Cart errors might be retryable
  if (error.code?.startsWith("cart/")) return true;

  // By default, assume the error is retryable
  return true;
};

export const getErrorActions = (
  error: ErrorType
): { label: string; action: string }[] => {
  const actions: { label: string; action: string }[] = [];

  if (error.code?.startsWith("auth/")) {
    actions.push({ label: "Sign In", action: "login" });
  }

  if (error.code?.startsWith("payment/")) {
    actions.push({ label: "Try Different Payment", action: "change-payment" });
  }

  if (error.code?.startsWith("cart/out-of-stock")) {
    actions.push({ label: "Remove Item", action: "remove-item" });
    actions.push({ label: "Save for Later", action: "save-for-later" });
  }

  return actions;
};

export const formatErrorDetails = (error: ErrorType): string => {
  const details: string[] = [];

  if (error.code) {
    details.push(`Error Code: ${error.code}`);
  }

  if (error.status) {
    details.push(`Status: ${error.status}`);
  }

  if (error.field) {
    details.push(`Field: ${error.field}`);
  }

  return details.join(" | ");
};
