import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IOrderPayState from "../interfaces/IOrderPayState";
import IUserLoginState from "../interfaces/IUserLoginState";
import { PaymentError, ApiError } from "../types/errors";

export interface IPayOrderProps {
  id: string;
  paymentResult: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
}

export const payOrder = createAsyncThunk(
  "order/payOrder",
  async (
    { id, paymentResult }: IPayOrderProps,
    { rejectWithValue, getState }
  ) => {
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

      const { data } = await axios.put(
        `/api/orders/${id}/pay`,
        paymentResult,
        config
      );

      return data;
    } catch (error: any) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || error.message;

        if (status === 400) {
          const paymentError: PaymentError = {
            message: "Payment validation failed",
            code: "PAYMENT_FAILED",
            status: 400,
          };
          return rejectWithValue(paymentError);
        } else if (status === 402) {
          const paymentError: PaymentError = {
            message: "Payment declined",
            code: "PAYMENT_DECLINED",
            status: 402,
          };
          return rejectWithValue(paymentError);
        } else if (status === 500) {
          const paymentError: PaymentError = {
            message: "Payment processing failed",
            code: "PAYMENT_FAILED",
            status: 500,
          };
          return rejectWithValue(paymentError);
        }
      }

      // Generic payment error
      const paymentError: PaymentError = {
        message: error.message || "Payment failed",
        code: "PAYMENT_FAILED",
        status: 500,
      };
      return rejectWithValue(paymentError);
    }
  }
);

const initialState = {
  loading: "idle",
  error: undefined,
} as IOrderPayState;

export const orderPaySlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    payReset: (state) => {
      state.loading = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(payOrder.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loading = "succeeded";
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as PaymentError;
      });
  },
});

export const { payReset } = orderPaySlice.actions;

export default orderPaySlice.reducer;
