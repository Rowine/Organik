import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IOrderState from "../interfaces/IOrderState";
import IUserLoginState from "../interfaces/IUserLoginState";
import { ICartItem } from "../interfaces/ICartState";
import { ApiError, ValidationError } from "../types/errors";

interface IOrderProps {
  orderItems: ICartItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
}

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order: IOrderProps, { rejectWithValue, getState }) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState() as { userLogin: IUserLoginState };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.post(`/api/orders`, order, config);

      return data;
    } catch (error: any) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || error.message;

        if (status === 400) {
          const validationError: ValidationError = {
            message: "Order validation failed",
            code: "VALIDATION_ERROR",
            status: 400,
            field: "order",
          };
          return rejectWithValue(validationError);
        } else if (status === 401) {
          const apiError: ApiError = {
            message: "Authentication required",
            code: "UNAUTHORIZED",
            status: 401,
          };
          return rejectWithValue(apiError);
        } else if (status === 500) {
          const apiError: ApiError = {
            message: "Failed to create order",
            code: "SERVER_ERROR",
            status: 500,
          };
          return rejectWithValue(apiError);
        }
      }

      // Generic API error
      const apiError: ApiError = {
        message: error.message || "Failed to create order",
        code: "SERVER_ERROR",
        status: 500,
      };
      return rejectWithValue(apiError);
    }
  }
);

const initialState = {
  loading: "idle",
  order: {} as IOrderState["order"],
  error: undefined,
} as IOrderState;

export const orderCreateSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as ApiError | ValidationError;
      });
  },
});

export default orderCreateSlice.reducer;
