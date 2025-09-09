import orderCreateSlice from "./../features/orderSlice";
import { configureStore } from "@reduxjs/toolkit";
import productListSlice from "../features/productListSlice";
import productDetailsSlice from "../features/productDetailsSlice";
import productDeleteSlice from "../features/productDeleteSlice";
import productCreateSlice from "../features/productCreateSlice";
import productUpdateSlice from "../features/productUpdateSlice";
import productCreateReviewSlice from "../features/productCreateReviewSlice";
import cartSlice from "../features/cartSlice";
import likeSlice from "../features/likeSlice";
import userLoginSlice from "../features/userLoginSlice";
import userRegisterSlice from "../features/userRegisterSlice";
import userDetailsSlice from "../features/userDetailsSlice";
import userUpdateProfileSlice from "../features/userUpdateProfileSlice";
import userUpdateSlice from "../features/userUpdateSlice";
import orderDetailsSlice from "../features/orderDetailsSlice";
import orderPaySlice from "../features/orderPaySlice";
import orderListMySlice from "../features/orderListMySlice";
import orderListSlice from "../features/orderListSlice";
import orderDeliver from "../features/orderDeliverSlice";
import userListSlice from "../features/userListSlice";
import userDeleteSlice from "../features/userDeleteSlice";
import ICartState from "../interfaces/ICartState";
import IUserLoginState from "../interfaces/IUserLoginState";
import { useLocalStorage } from "../hooks/useLocalStorage";

/**
 * Custom hook to manage all localStorage state for the Redux store
 * This hook provides a centralized way to manage persistent state
 * with proper error handling and type safety
 *
 * Use this hook in React components that need to manage localStorage state
 * outside of the Redux store, or for components that need direct access
 * to localStorage values with automatic synchronization
 */
export const useStoreLocalStorage = () => {
  const cartItemsHook = useLocalStorage("cartItems", []);
  const userInfoHook = useLocalStorage("userInfo", null);
  const shippingAddressHook = useLocalStorage("shippingAddress", {});
  const paymentMethodHook = useLocalStorage("paymentMethod", "");

  return {
    cartItems: cartItemsHook.value,
    userInfo: userInfoHook.value,
    shippingAddress: shippingAddressHook.value,
    paymentMethod: paymentMethodHook.value,
    // Expose setters for components that need them
    setCartItems: cartItemsHook.setValue,
    setUserInfo: userInfoHook.setValue,
    setShippingAddress: shippingAddressHook.setValue,
    setPaymentMethod: paymentMethodHook.setValue,
    // Expose utility methods
    removeCartItems: cartItemsHook.removeValue,
    removeUserInfo: userInfoHook.removeValue,
    removeShippingAddress: shippingAddressHook.removeValue,
    removePaymentMethod: paymentMethodHook.removeValue,
    // Expose loading and error states
    isLoading:
      cartItemsHook.isLoading ||
      userInfoHook.isLoading ||
      shippingAddressHook.isLoading ||
      paymentMethodHook.isLoading,
    hasError:
      cartItemsHook.hasError ||
      userInfoHook.hasError ||
      shippingAddressHook.hasError ||
      paymentMethodHook.hasError,
    errors: [
      cartItemsHook.error,
      userInfoHook.error,
      shippingAddressHook.error,
      paymentMethodHook.error,
    ].filter(Boolean),
  };
};

const reducer = {
  productList: productListSlice,
  productDetails: productDetailsSlice,
  productDelete: productDeleteSlice,
  productCreate: productCreateSlice,
  productUpdate: productUpdateSlice,
  productCreateReview: productCreateReviewSlice,
  cart: cartSlice,
  like: likeSlice,
  userLogin: userLoginSlice,
  userRegister: userRegisterSlice,
  userDetails: userDetailsSlice,
  userUpdateProfile: userUpdateProfileSlice,
  userList: userListSlice,
  userDelete: userDeleteSlice,
  userUpdate: userUpdateSlice,
  orderCreate: orderCreateSlice,
  orderDetails: orderDetailsSlice,
  orderPay: orderPaySlice,
  orderListMy: orderListMySlice,
  orderList: orderListSlice,
  orderDeliver: orderDeliver,
};

/**
 * Initialize localStorage values for the store
 * This function safely retrieves values from localStorage with proper error handling
 */
const initializeLocalStorageValues = () => {
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

const localStorageValues = initializeLocalStorageValues();

const preloadedState = {
  cart: {
    loading: "idle",
    cartItems: localStorageValues.cartItems,
    shippingAddress: localStorageValues.shippingAddress,
    paymentMethod: localStorageValues.paymentMethod,
    error: undefined,
  } as ICartState,
  userLogin: {
    loading: "idle",
    userInfo: localStorageValues.userInfo,
    error: undefined,
  } as IUserLoginState,
};

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== "production",
  preloadedState,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

/**
 * Utility function to sync Redux state with localStorage
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
