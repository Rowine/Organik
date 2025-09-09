/**
 * Utility functions for localStorage operations
 * These functions provide safe localStorage operations with proper error handling
 */

/**
 * Utility function to sync state with localStorage
 * Use this in Redux actions or middleware to keep localStorage in sync
 *
 * @example
 * ```typescript
 * // In a Redux action
 * const updateCartItems = (items) => {
 *   // Update Redux state
 *   dispatch(setCartItems(items));
 *   // Sync with localStorage
 *   syncWithLocalStorage('cartItems', items);
 * };
 * ```
 */
export const syncWithLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to sync ${key} with localStorage:`, error);
  }
};

/**
 * Utility function to clear all store-related localStorage items
 * Use this when logging out or resetting the application state
 */
export const clearStoreLocalStorage = () => {
  try {
    localStorage.removeItem("cartItems");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
  } catch (error) {
    console.error("Failed to clear store localStorage:", error);
  }
};

/**
 * Initialize localStorage values for the store
 * This function safely retrieves values from localStorage with proper error handling
 */
export const initializeLocalStorageValues = () => {
  try {
    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems") as string)
      : [];

    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo") as string)
      : null;

    const shippingAddress = localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress") as string)
      : {};

    const paymentMethod = localStorage.getItem("paymentMethod")
      ? JSON.parse(localStorage.getItem("paymentMethod") as string)
      : "";

    return {
      cartItems,
      userInfo,
      shippingAddress,
      paymentMethod,
    };
  } catch (error) {
    console.error("Error initializing localStorage values:", error);
    return {
      cartItems: [],
      userInfo: null,
      shippingAddress: {},
      paymentMethod: "",
    };
  }
};
