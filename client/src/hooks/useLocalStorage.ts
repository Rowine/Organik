import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for managing localStorage with type safety, error handling, and SSR compatibility.
 *
 * This hook provides a clean interface for reading from and writing to localStorage,
 * with automatic serialization/deserialization, error handling, and SSR safety.
 *
 * @template T - The type of the value stored in localStorage
 * @param key - The localStorage key
 * @param initialValue - The initial value to use if no value exists in localStorage
 * @param options - Configuration options for the hook
 *
 * @returns An object containing the current value, setter function, and utility methods
 *
 * @example
 * ```typescript
 * // Basic usage
 * const [user, setUser] = useLocalStorage('user', null);
 *
 * // With options
 * const [cart, setCart] = useLocalStorage('cart', [], {
 *   serializer: JSON.stringify,
 *   deserializer: JSON.parse,
 *   syncAcrossTabs: true
 * });
 *
 * // Using utility methods
 * const { value, setValue, removeValue, clearAll } = useLocalStorage('theme', 'light');
 * ```
 */
export interface UseLocalStorageOptions<T> {
  /**
   * Custom serializer function. Defaults to JSON.stringify
   */
  serializer?: (value: T) => string;

  /**
   * Custom deserializer function. Defaults to JSON.parse
   */
  deserializer?: (value: string) => T;

  /**
   * Whether to sync changes across browser tabs. Defaults to true
   */
  syncAcrossTabs?: boolean;

  /**
   * Whether to log errors to console. Defaults to false
   */
  logErrors?: boolean;

  /**
   * Custom error handler for localStorage errors
   */
  onError?: (error: Error, operation: "get" | "set" | "remove") => void;
}

export interface UseLocalStorageReturn<T> {
  /**
   * The current value from localStorage
   */
  value: T;

  /**
   * Function to update the value in localStorage
   */
  setValue: (value: T | ((prevValue: T) => T)) => void;

  /**
   * Function to remove the value from localStorage
   */
  removeValue: () => void;

  /**
   * Function to clear all localStorage items (use with caution)
   */
  clearAll: () => void;

  /**
   * Whether the value is currently being loaded from localStorage
   */
  isLoading: boolean;

  /**
   * Whether there was an error during the last operation
   */
  hasError: boolean;

  /**
   * The last error that occurred
   */
  error: Error | null;
}

/**
 * Checks if localStorage is available in the current environment
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === "undefined") {
      return false; // SSR environment
    }

    const testKey = "__localStorage_test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Default error handler that logs errors to console
 */
const defaultErrorHandler = (
  error: Error,
  operation: string,
  logErrors: boolean
): void => {
  if (logErrors) {
    console.error(`useLocalStorage ${operation} error:`, error);
  }
};

/**
 * Custom hook for managing localStorage with comprehensive features
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    syncAcrossTabs = true,
    logErrors = false,
    onError = (error, operation) =>
      defaultErrorHandler(error, operation, logErrors),
  } = options;

  // State to track the current value
  const [value, setValue] = useState<T>(initialValue);

  // State to track loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Ref to track if this is the initial load
  const isInitialLoad = useRef(true);

  // Ref to prevent infinite loops in useEffect
  const isSettingValue = useRef(false);

  /**
   * Safely gets a value from localStorage
   */
  const getValueFromStorage = useCallback((): T => {
    if (!isLocalStorageAvailable()) {
      return initialValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      return deserializer(item);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to deserialize localStorage value");
      setError(error);
      setHasError(true);
      onError(error, "get");
      return initialValue;
    }
  }, [key, initialValue, deserializer, onError]);

  /**
   * Safely sets a value in localStorage
   */
  const setValueInStorage = useCallback(
    (newValue: T): void => {
      if (!isLocalStorageAvailable()) {
        return;
      }

      try {
        const serializedValue = serializer(newValue);
        localStorage.setItem(key, serializedValue);
        setError(null);
        setHasError(false);
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to serialize value for localStorage");
        setError(error);
        setHasError(true);
        onError(error, "set");
      }
    },
    [key, serializer, onError]
  );

  /**
   * Safely removes a value from localStorage
   */
  const removeValueFromStorage = useCallback((): void => {
    if (!isLocalStorageAvailable()) {
      return;
    }

    try {
      localStorage.removeItem(key);
      setError(null);
      setHasError(false);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to remove value from localStorage");
      setError(error);
      setHasError(true);
      onError(error, "remove");
    }
  }, [key, onError]);

  /**
   * Handles storage events from other tabs
   */
  const handleStorageChange = useCallback(
    (event: StorageEvent): void => {
      if (event.key === key && event.storageArea === localStorage) {
        if (event.newValue === null) {
          setValue(initialValue);
        } else {
          try {
            const newValue = deserializer(event.newValue);
            setValue(newValue);
          } catch (err) {
            const error =
              err instanceof Error
                ? err
                : new Error("Failed to deserialize value from storage event");
            setError(error);
            setHasError(true);
            onError(error, "get");
          }
        }
      }
    },
    [key, initialValue, deserializer, onError]
  );

  // Load initial value from localStorage on mount
  useEffect(() => {
    if (isInitialLoad.current) {
      const storedValue = getValueFromStorage();
      setValue(storedValue);
      setIsLoading(false);
      isInitialLoad.current = false;
    }
  }, [getValueFromStorage]);

  // Set up storage event listener for cross-tab synchronization
  useEffect(() => {
    if (!syncAcrossTabs || !isLocalStorageAvailable()) {
      return;
    }

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [syncAcrossTabs, handleStorageChange]);

  /**
   * Updates the value in both state and localStorage
   */
  const setValueHandler = useCallback(
    (newValue: T | ((prevValue: T) => T)) => {
      if (isSettingValue.current) {
        return; // Prevent infinite loops
      }

      isSettingValue.current = true;

      setValue((prevValue) => {
        const resolvedValue =
          typeof newValue === "function"
            ? (newValue as (prevValue: T) => T)(prevValue)
            : newValue;

        setValueInStorage(resolvedValue);
        return resolvedValue;
      });

      // Reset the flag after a short delay
      setTimeout(() => {
        isSettingValue.current = false;
      }, 0);
    },
    [setValueInStorage]
  );

  /**
   * Removes the value from both state and localStorage
   */
  const removeValueHandler = useCallback(() => {
    setValue(initialValue);
    removeValueFromStorage();
  }, [initialValue, removeValueFromStorage]);

  /**
   * Clears all localStorage items (use with caution)
   */
  const clearAllHandler = useCallback(() => {
    if (!isLocalStorageAvailable()) {
      return;
    }

    try {
      localStorage.clear();
      setValue(initialValue);
      setError(null);
      setHasError(false);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to clear localStorage");
      setError(error);
      setHasError(true);
      onError(error, "remove");
    }
  }, [initialValue, onError]);

  return {
    value,
    setValue: setValueHandler,
    removeValue: removeValueHandler,
    clearAll: clearAllHandler,
    isLoading,
    hasError,
    error,
  };
}

/**
 * Utility hook for managing multiple localStorage keys at once
 *
 * @param keys - Array of key-value pairs for localStorage management
 * @param options - Configuration options for the hook
 *
 * @example
 * ```typescript
 * const { values, setValue, removeValue } = useMultipleLocalStorage([
 *   ['user', null],
 *   ['theme', 'light'],
 *   ['cart', []]
 * ]);
 * ```
 */
export function useMultipleLocalStorage<T extends Record<string, any>>(
  keys: Array<[keyof T, T[keyof T]]>,
  options: Omit<UseLocalStorageOptions<any>, "serializer" | "deserializer"> = {}
) {
  const hooks = keys.map(([key, initialValue]) =>
    useLocalStorage(key as string, initialValue, options)
  );

  const values = keys.reduce((acc, [key], index) => {
    acc[key] = hooks[index].value;
    return acc;
  }, {} as T);

  const setValue = (
    key: keyof T,
    value: T[keyof T] | ((prevValue: T[keyof T]) => T[keyof T])
  ) => {
    const hookIndex = keys.findIndex(([k]) => k === key);
    if (hookIndex !== -1) {
      hooks[hookIndex].setValue(value);
    }
  };

  const removeValue = (key: keyof T) => {
    const hookIndex = keys.findIndex(([k]) => k === key);
    if (hookIndex !== -1) {
      hooks[hookIndex].removeValue();
    }
  };

  const clearAll = () => {
    hooks.forEach((hook) => hook.clearAll());
  };

  const isLoading = hooks.some((hook) => hook.isLoading);
  const hasError = hooks.some((hook) => hook.hasError);
  const errors = hooks.map((hook) => hook.error).filter(Boolean);

  return {
    values,
    setValue,
    removeValue,
    clearAll,
    isLoading,
    hasError,
    errors,
  };
}

export default useLocalStorage;
