import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import ICartState from "../interfaces/ICartState";
import { CartError, ResourceError } from "../types/errors";
import {
  syncWithLocalStorage,
  clearStoreLocalStorage,
} from "../utils/localStorage";

/**
 * Cart-specific utility functions for localStorage operations
 * These functions provide safe localStorage operations with proper error handling
 */
const syncCartWithLocalStorage = (key: string, value: any) => {
  try {
    syncWithLocalStorage(key, value);
  } catch (error) {
    console.error(`Failed to sync cart ${key} with localStorage:`, error);
  }
};

interface IAddToCart {
  id: string;
  qty: number;
}

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, qty }: IAddToCart, { getState, rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);

      dispatch(
        cartSlice.actions.addToCart({
          product: data._id,
          name: data.name,
          image: data.image,
          price: data.price,
          countInStock: data.countInStock,
          qty,
        })
      );

      const {
        cart: { cartItems },
      } = getState() as { cart: ICartState };
      syncCartWithLocalStorage("cartItems", cartItems);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || error.message;

        if (status === 404) {
          // Product not found
          const resourceError: ResourceError = {
            message: "Product not found",
            code: "NOT_FOUND",
            status: 404,
            resourceType: "product",
            resourceId: id,
          };
          return rejectWithValue(resourceError);
        }
      }

      // Generic cart error
      return rejectWithValue({
        message: "Failed to add item to cart",
        code: "CART_EMPTY",
        status: 500,
        productId: id,
      } as CartError);
    }
  }
);

const initialState = {
  loading: "idle",
  cartItems: [],
  shippingAddress: {
    address: "",
    city: "",
    postalCode: "",
  },
  paymentMethod: "",
  itemsPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  error: undefined,
} as ICartState;

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      // Check stock availability
      if (item.qty > item.countInStock) {
        state.error = {
          message: "Not enough items in stock",
          code: "QUANTITY_EXCEEDED",
          status: 400,
          productId: item.product,
          availableQuantity: item.countInStock,
        } as CartError;
        return;
      }

      // Check if item is out of stock
      if (item.countInStock === 0) {
        state.error = {
          message: "This item is out of stock",
          code: "ITEM_OUT_OF_STOCK",
          status: 400,
          productId: item.product,
        } as CartError;
        return;
      }

      // Clear any previous errors
      state.error = undefined;

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== action.payload
      );

      syncCartWithLocalStorage("cartItems", state.cartItems);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;

      syncCartWithLocalStorage("shippingAddress", state.shippingAddress);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;

      syncCartWithLocalStorage("paymentMethod", state.paymentMethod);
    },
    savePrices: (state, action) => {
      state.itemsPrice = action.payload.itemsPrice;
      state.shippingPrice = action.payload.shippingPrice;
      state.totalPrice = action.payload.totalPrice;
    },
    resetCart: (state) => {
      state.cartItems = [];
      syncCartWithLocalStorage("cartItems", []);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addToCart.fulfilled, (state) => {
      state.loading = "idle";
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = "idle";
      state.error = action.payload as CartError | ResourceError;
    });
  },
});

export const {
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  savePrices,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
