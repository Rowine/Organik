import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useLocalStorage } from "./useLocalStorage";
import { ICartItem } from "../interfaces/ICartState";
import { saveShippingAddress, savePaymentMethod } from "../features/cartSlice";

/**
 * Custom hook for managing cart data persistence with localStorage
 * Bridges Redux cart state with localStorage and provides automatic synchronization
 *
 * @example
 * ```typescript
 * const {
 *   cartItems,
 *   shippingAddress,
 *   paymentMethod,
 *   updateShippingAddress,
 *   updatePaymentMethod,
 *   clearCartStorage
 * } = useCartStorage();
 * ```
 */
export const useCartStorage = () => {
  const dispatch = useAppDispatch();

  // Redux state
  const { cartItems, shippingAddress, paymentMethod } = useAppSelector(
    (state) => state.cart
  );

  // localStorage hooks with type safety
  const { value: storedCartItems, setValue: setStoredCartItems } =
    useLocalStorage<ICartItem[]>("cartItems", [], {
      onError: (error) => {
        console.error("Failed to sync cart items with localStorage:", error);
      },
    });

  const { value: storedShippingAddress, setValue: setStoredShippingAddress } =
    useLocalStorage(
      "shippingAddress",
      {},
      {
        onError: (error) => {
          console.error(
            "Failed to sync shipping address with localStorage:",
            error
          );
        },
      }
    );

  const { value: storedPaymentMethod, setValue: setStoredPaymentMethod } =
    useLocalStorage<string>("paymentMethod", "", {
      onError: (error) => {
        console.error(
          "Failed to sync payment method with localStorage:",
          error
        );
      },
    });

  // Sync Redux state to localStorage
  useEffect(() => {
    if (
      cartItems.length !== storedCartItems.length ||
      JSON.stringify(cartItems) !== JSON.stringify(storedCartItems)
    ) {
      setStoredCartItems(cartItems);
    }
  }, [cartItems, setStoredCartItems]);

  useEffect(() => {
    if (
      JSON.stringify(shippingAddress) !== JSON.stringify(storedShippingAddress)
    ) {
      setStoredShippingAddress(shippingAddress);
    }
  }, [shippingAddress, setStoredShippingAddress]);

  useEffect(() => {
    if (paymentMethod !== storedPaymentMethod) {
      setStoredPaymentMethod(paymentMethod);
    }
  }, [paymentMethod, setStoredPaymentMethod]);

  // Sync localStorage to Redux state
  useEffect(() => {
    if (
      JSON.stringify(storedShippingAddress) !== JSON.stringify(shippingAddress)
    ) {
      dispatch(saveShippingAddress(storedShippingAddress));
    }
  }, [storedShippingAddress, dispatch]);

  useEffect(() => {
    if (storedPaymentMethod !== paymentMethod) {
      dispatch(savePaymentMethod(storedPaymentMethod));
    }
  }, [storedPaymentMethod, dispatch]);

  // Utility functions
  const updateShippingAddress = (address: typeof shippingAddress) => {
    dispatch(saveShippingAddress(address));
    setStoredShippingAddress(address);
  };

  const updatePaymentMethod = (method: string) => {
    dispatch(savePaymentMethod(method));
    setStoredPaymentMethod(method);
  };

  const clearCartStorage = () => {
    setStoredCartItems([]);
    setStoredShippingAddress({});
    setStoredPaymentMethod("");
  };

  return {
    // Values
    cartItems: storedCartItems,
    shippingAddress: storedShippingAddress,
    paymentMethod: storedPaymentMethod,
    // Actions
    updateShippingAddress,
    updatePaymentMethod,
    clearCartStorage,
    // State
    isLoading: false, // Combined loading state if needed
    hasError: false, // Combined error state if needed
  };
};

export default useCartStorage;
