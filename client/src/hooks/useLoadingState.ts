import { useState, useCallback, useMemo } from "react";
import { LoadingState, UseLoadingStateReturn } from "../types/loading";

/**
 * useLoadingState Hook
 *
 * A custom hook for managing loading states in components.
 *
 *
 * Usage Examples:
 *
 * // Basic usage
 * const { isLoading, startLoading, stopLoading } = useLoadingState();
 *
 * // With initial state
 * const { isLoading, isError, startLoading, stopLoadingWithError } = useLoadingState('pending');
 *
 * // In async operations
 * const handleSubmit = async () => {
 *   startLoading();
 *   try {
 *     await submitData();
 *     stopLoading();
 *   } catch (error) {
 *     stopLoadingWithError(error.message);
 *   }
 * };
 */
export const useLoadingState = (
  initialState: LoadingState = "idle"
): UseLoadingStateReturn => {
  const [loading, setLoading] = useState<LoadingState>(initialState);
  const [error, setError] = useState<string | undefined>(undefined);

  // Computed loading states
  const isLoading = useMemo(() => loading === "pending", [loading]);
  const isSuccess = useMemo(() => loading === "succeeded", [loading]);
  const isError = useMemo(() => loading === "failed", [loading]);
  const isIdle = useMemo(() => loading === "idle", [loading]);

  // Loading state management functions
  const startLoading = useCallback(() => {
    setLoading("pending");
    setError(undefined);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading("succeeded");
    setError(undefined);
  }, []);

  const stopLoadingWithError = useCallback((errorMessage: string) => {
    setLoading("failed");
    setError(errorMessage);
  }, []);

  const resetLoading = useCallback(() => {
    setLoading("idle");
    setError(undefined);
  }, []);

  const setLoadingState = useCallback((state: LoadingState) => {
    setLoading(state);
    if (state !== "failed") {
      setError(undefined);
    }
  }, []);

  return {
    loading,
    isLoading,
    isSuccess,
    isError,
    isIdle,
    error,
    setLoading: setLoadingState,
    startLoading,
    stopLoading,
    stopLoadingWithError,
    resetLoading,
  };
};

/**
 * useAsyncLoading Hook
 *
 * A specialized hook for handling async operations with loading states.
 *
 * Usage Examples:
 *
 * // Basic async operation
 * const { execute, isLoading, error } = useAsyncLoading(async () => {
 *   const result = await fetchData();
 *   return result;
 * });
 *
 * // With error handling
 * const { execute, isLoading, error, data } = useAsyncLoading(
 *   async (params) => {
 *     const result = await fetchData(params);
 *     return result;
 *   },
 *   {
 *     onSuccess: (data) => console.log('Success:', data),
 *     onError: (error) => console.error('Error:', error)
 *   }
 * );
 */
interface UseAsyncLoadingOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

interface UseAsyncLoadingReturn<T> {
  execute: (...args: any[]) => Promise<T | undefined>;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: string | undefined;
  data: T | undefined;
  reset: () => void;
}

export const useAsyncLoading = <T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncLoadingOptions<T> = {}
): UseAsyncLoadingReturn<T> => {
  const { onSuccess, onError, onFinally } = options;
  const {
    isLoading,
    isError,
    isSuccess,
    error,
    startLoading,
    stopLoading,
    stopLoadingWithError,
    resetLoading,
  } = useLoadingState();

  const [data, setData] = useState<T | undefined>(undefined);

  const execute = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      startLoading();
      setData(undefined);

      try {
        const result = await asyncFunction(...args);
        setData(result);
        stopLoading();
        onSuccess?.(result);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        stopLoadingWithError(errorMessage);
        onError?.(error instanceof Error ? error : new Error(errorMessage));
        return undefined;
      } finally {
        onFinally?.();
      }
    },
    [
      asyncFunction,
      startLoading,
      stopLoading,
      stopLoadingWithError,
      onSuccess,
      onError,
      onFinally,
    ]
  );

  const reset = useCallback(() => {
    resetLoading();
    setData(undefined);
  }, [resetLoading]);

  return {
    execute,
    isLoading,
    isError,
    isSuccess,
    error,
    data,
    reset,
  };
};
