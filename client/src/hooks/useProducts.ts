import { useEffect, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  listProducts as fetchProducts,
  backgroundRefreshProducts,
  selectProductsByCategory,
  selectProductsState,
  selectIsDataStale,
  markAsStale,
  invalidateCache,
} from "../features/productListSlice";
import IProductItem from "../interfaces/IProductItem";
import { AppError } from "../types/errors";

interface UseProductsOptions {
  category?: string;
  forceRefresh?: boolean;
  enableBackgroundRefresh?: boolean;
  autoFetch?: boolean;
}

interface UseProductsReturn {
  products: IProductItem[];
  allProducts: IProductItem[];
  isLoading: boolean;
  isInitialLoading: boolean;
  error?: AppError | string;
  isStale: boolean;
  lastFetched?: number;

  // Actions
  refetch: () => void;
  invalidate: () => void;
  markStale: () => void;
}

/**
 * Custom hook for managing product data with smart caching and performance optimizations
 *
 * @param options Configuration options for the hook
 * @returns Object containing products data and control functions
 *
 * Benefits:
 * - Eliminates duplicate API calls across components
 * - Provides intelligent caching with staleness detection
 * - Offers background refresh capabilities
 * - Optimizes rendering with memoized selectors
 * - Centralizes product fetching logic
 */
export const useProducts = (
  options: UseProductsOptions = {}
): UseProductsReturn => {
  const {
    category,
    forceRefresh = false,
    enableBackgroundRefresh = true,
    autoFetch = true,
  } = options;

  const dispatch = useAppDispatch();

  // Use memoized selectors for better performance
  const productsState = useAppSelector(selectProductsState);
  const categoryProducts = useAppSelector(
    selectProductsByCategory(category || "")
  );
  const isDataStale = useAppSelector(selectIsDataStale);

  const {
    products: allProducts,
    loading,
    error,
    isStale,
    lastFetched,
  } = productsState;

  // Memoized filtered products for the requested category
  const filteredProducts = useMemo(() => {
    if (!category) return allProducts;

    // Use cached category data if available, otherwise filter
    if (categoryProducts.length > 0) {
      return categoryProducts;
    }

    return allProducts.filter((product) => product.category === category);
  }, [allProducts, category, categoryProducts]);

  // Determine loading states
  const isInitialLoading = loading === "pending" && allProducts.length === 0;
  const isLoading = loading === "pending";

  // Action creators
  const refetch = useCallback(() => {
    dispatch(fetchProducts({ forceRefresh: true, category }));
  }, [dispatch, category]);

  const invalidate = useCallback(() => {
    dispatch(invalidateCache());
  }, [dispatch]);

  const markStale = useCallback(() => {
    dispatch(markAsStale());
  }, [dispatch]);

  // Auto-fetch products on mount or when dependencies change
  useEffect(() => {
    if (!autoFetch) return;

    const shouldFetch =
      allProducts.length === 0 || // No data yet
      forceRefresh || // Force refresh requested
      isDataStale; // Data is stale

    if (shouldFetch) {
      dispatch(fetchProducts({ forceRefresh, category }));
    }
  }, [
    dispatch,
    autoFetch,
    forceRefresh,
    category,
    allProducts.length,
    isDataStale,
  ]);

  // Background refresh effect
  useEffect(() => {
    if (!enableBackgroundRefresh) return;

    const interval = setInterval(() => {
      // Only do background refresh if the tab is visible
      if (document.visibilityState === "visible") {
        dispatch(backgroundRefreshProducts());
      }
    }, 2 * 60 * 1000); // Check every 2 minutes

    return () => clearInterval(interval);
  }, [dispatch, enableBackgroundRefresh]);

  // Handle visibility change for smart refreshing
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isDataStale) {
        // Refresh data when user returns to tab and data is stale
        dispatch(fetchProducts({ forceRefresh: true }));
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [dispatch, isDataStale]);

  return {
    products: filteredProducts,
    allProducts,
    isLoading,
    isInitialLoading,
    error,
    isStale,
    lastFetched,
    refetch,
    invalidate,
    markStale,
  };
};

/**
 * Simplified hook for just getting products without fetching logic
 * Useful when you know the data is already loaded
 */
export const useProductsData = (category?: string) => {
  const productsState = useAppSelector(selectProductsState);
  const categoryProducts = useAppSelector(
    selectProductsByCategory(category || "")
  );

  const filteredProducts = useMemo(() => {
    if (!category) return productsState.products;
    return categoryProducts.length > 0
      ? categoryProducts
      : productsState.products.filter(
          (product) => product.category === category
        );
  }, [productsState.products, category, categoryProducts]);

  return {
    products: filteredProducts,
    allProducts: productsState.products,
    isLoading: productsState.loading === "pending",
    error: productsState.error,
  };
};

/**
 * Hook for trending products (first 4 products)
 */
export const useTrendingProducts = () => {
  const { products, isLoading, error } = useProducts();

  const trendingProducts = useMemo(() => products.slice(0, 4), [products]);

  return {
    trendingProducts,
    isLoading,
    error,
  };
};

/**
 * Hook for customer purchase recommendations (products 5-8)
 */
export const useCustomerPurchaseProducts = () => {
  const { products, isLoading, error } = useProducts();

  const customerPurchase = useMemo(() => products.slice(5, 9), [products]);

  return {
    customerPurchase,
    isLoading,
    error,
  };
};
