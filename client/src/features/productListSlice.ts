import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IProductItem from "../interfaces/IProductItem";
import IProductListState from "../interfaces/IProductListState";
import { ApiError, ResourceError } from "../types/errors";

// Configuration constants
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const BACKGROUND_REFRESH_THRESHOLD = 3 * 60 * 1000; // 3 minutes

// Request deduplication tracking
let pendingRequests: Map<string, Promise<any>> = new Map();

// Enhanced async thunk with caching logic and request deduplication
export const listProducts = createAsyncThunk(
  "products/listProducts",
  async (
    options: {
      forceRefresh?: boolean;
      category?: string;
    } = {},
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { productList: IProductListState };
      const currentTime = Date.now();
      const { lastFetched, products, cacheExpiry } = state.productList;

      // Check if we need to fetch new data
      const isDataStale =
        !lastFetched || currentTime - lastFetched > cacheExpiry;
      const shouldForceRefresh = options.forceRefresh;

      // Return cached data if it's fresh and no force refresh
      if (!isDataStale && !shouldForceRefresh && products.length > 0) {
        return {
          products,
          fromCache: true,
          timestamp: lastFetched,
        };
      }

      // Create a unique key for this request
      const requestKey = `products_${
        options.category || "all"
      }_${shouldForceRefresh}`;

      // Check if there's already a pending request for this data
      if (pendingRequests.has(requestKey)) {
        // Wait for the existing request to complete
        const result = await pendingRequests.get(requestKey);
        return result;
      }

      // Create new request promise
      const requestPromise = (async () => {
        try {
          const { data } = await axios.get("/api/products");
          return {
            products: data,
            fromCache: false,
            timestamp: currentTime,
          };
        } finally {
          // Clean up the pending request
          pendingRequests.delete(requestKey);
        }
      })();

      // Store the pending request
      pendingRequests.set(requestKey, requestPromise);

      // Return the result
      return await requestPromise;
    } catch (error) {
      let apiError: ResourceError = {
        message: "Failed to fetch products",
        code: "NOT_FOUND",
        status: 404,
        resourceType: "product",
      };

      if (error instanceof AxiosError) {
        if (error.response) {
          apiError = {
            message: error.response.data.message || error.message,
            code: error.response.status === 404 ? "NOT_FOUND" : "FORBIDDEN",
            status: error.response.status,
            resourceType: "product",
          };
        } else if (error.request) {
          apiError = {
            message: "Network error while fetching products",
            code: "NOT_FOUND",
            status: 0,
            resourceType: "product",
          };
        }
      }

      return rejectWithValue(apiError);
    }
  }
);

// Background refresh thunk for silent updates
export const backgroundRefreshProducts = createAsyncThunk(
  "products/backgroundRefresh",
  async (_, { getState, dispatch }) => {
    const state = getState() as { productList: IProductListState };
    const currentTime = Date.now();
    const { lastFetched, cacheExpiry } = state.productList;

    // Only refresh if data is stale
    if (!lastFetched || currentTime - lastFetched > cacheExpiry) {
      dispatch(listProducts({ forceRefresh: true }));
    }
  }
);

const initialState: IProductListState = {
  loading: "idle",
  products: [],
  error: undefined,
  lastFetched: undefined,
  cacheExpiry: CACHE_DURATION,
  categories: {},
  isStale: false,
};

export const productListSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Mark data as stale without clearing it
    markAsStale: (state) => {
      state.isStale = true;
    },

    // Clear cache and force refresh
    invalidateCache: (state) => {
      state.products = [];
      state.categories = {};
      state.lastFetched = undefined;
      state.isStale = true;
    },

    // Update cache expiry settings
    updateCacheSettings: (state, action) => {
      state.cacheExpiry = action.payload.cacheExpiry || CACHE_DURATION;
    },

    // Precompute categories for faster filtering
    updateCategoryCache: (state) => {
      const categoriesMap: Record<string, IProductItem[]> = {};

      state.products.forEach((product) => {
        if (!categoriesMap[product.category]) {
          categoriesMap[product.category] = [];
        }
        categoriesMap[product.category].push(product);
      });

      state.categories = categoriesMap;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listProducts.pending, (state) => {
        // Only show loading if we don't have cached data
        if (state.products.length === 0) {
          state.loading = "pending";
        }
        state.error = undefined;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = "succeeded";

        // Only update if we got fresh data from API
        if (!action.payload.fromCache) {
          state.products = action.payload.products;
          state.lastFetched = action.payload.timestamp;
          state.isStale = false;

          // Update category cache
          const categoriesMap: Record<string, IProductItem[]> = {};
          action.payload.products.forEach((product: IProductItem) => {
            if (!categoriesMap[product.category]) {
              categoriesMap[product.category] = [];
            }
            categoriesMap[product.category].push(product);
          });
          state.categories = categoriesMap;
        }

        state.error = undefined;
      })
      .addCase(listProducts.rejected, (state, action) => {
        // Only set loading to failed if we don't have cached data to show
        if (state.products.length === 0) {
          state.loading = "failed";
        }
        state.error = action.payload as ResourceError;
        state.isStale = true;
      });
  },
});

export const {
  markAsStale,
  invalidateCache,
  updateCacheSettings,
  updateCategoryCache,
} = productListSlice.actions;

export default productListSlice.reducer;

// Selectors for better performance
export const selectAllProducts = (state: { productList: IProductListState }) =>
  state.productList.products;

export const selectProductsByCategory =
  (category: string) => (state: { productList: IProductListState }) =>
    state.productList.categories[category] || [];

export const selectProductsState = (state: {
  productList: IProductListState;
}) => ({
  products: state.productList.products,
  loading: state.productList.loading,
  error: state.productList.error,
  isStale: state.productList.isStale,
  lastFetched: state.productList.lastFetched,
});

export const selectIsDataStale = (state: {
  productList: IProductListState;
}) => {
  const { lastFetched, cacheExpiry } = state.productList;
  if (!lastFetched) return true;
  return Date.now() - lastFetched > cacheExpiry;
};
