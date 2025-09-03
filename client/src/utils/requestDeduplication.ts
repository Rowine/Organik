/**
 * Request deduplication utility to prevent multiple simultaneous API calls
 * for the same data. This improves performance and reduces server load.
 */

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

class RequestDeduplicator {
  private pendingRequests: Map<string, PendingRequest<any>> = new Map();
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds timeout

  /**
   * Execute a request with deduplication
   * @param key Unique key for the request
   * @param requestFn Function that performs the actual request
   * @returns Promise with the request result
   */
  async execute<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // Check if there's already a pending request
    const existingRequest = this.pendingRequests.get(key);

    if (existingRequest) {
      // Check if the existing request is still valid (not timed out)
      if (Date.now() - existingRequest.timestamp < this.REQUEST_TIMEOUT) {
        return existingRequest.promise;
      } else {
        // Remove expired request
        this.pendingRequests.delete(key);
      }
    }

    // Create new request
    const promise = requestFn().finally(() => {
      // Clean up after request completes (success or failure)
      this.pendingRequests.delete(key);
    });

    // Store the pending request
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
    });

    return promise;
  }

  /**
   * Check if a request is currently pending
   * @param key Unique key for the request
   * @returns True if request is pending
   */
  isPending(key: string): boolean {
    const request = this.pendingRequests.get(key);
    if (!request) return false;

    // Check if request has timed out
    if (Date.now() - request.timestamp > this.REQUEST_TIMEOUT) {
      this.pendingRequests.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear all pending requests
   */
  clear(): void {
    this.pendingRequests.clear();
  }

  /**
   * Get the number of pending requests
   */
  getPendingCount(): number {
    return this.pendingRequests.size;
  }
}

// Create a singleton instance
export const requestDeduplicator = new RequestDeduplicator();

/**
 * Hook for using request deduplication in components
 */
export const useRequestDeduplication = () => {
  return requestDeduplicator;
};

/**
 * Create a unique key for product requests
 */
export const createProductRequestKey = (options: {
  category?: string;
  forceRefresh?: boolean;
  searchTerm?: string;
}): string => {
  const { category, forceRefresh, searchTerm } = options;
  return `products_${category || "all"}_${
    forceRefresh ? "refresh" : "normal"
  }_${searchTerm || "none"}`;
};

/**
 * Create a unique key for user requests
 */
export const createUserRequestKey = (options: {
  userId?: string;
  action: string;
}): string => {
  const { userId, action } = options;
  return `user_${userId || "all"}_${action}`;
};

/**
 * Create a unique key for order requests
 */
export const createOrderRequestKey = (options: {
  orderId?: string;
  action: string;
}): string => {
  const { orderId, action } = options;
  return `order_${orderId || "all"}_${action}`;
};
