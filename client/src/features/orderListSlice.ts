import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IOrderListMy from "../interfaces/IOrderListMy";
import IUserLoginState from "../interfaces/IUserLoginState";
import { AuthError, ApiError } from "../types/errors";

export const listOrders = createAsyncThunk(
  "order/listOrders",
  async (thunkAPI, { rejectWithValue, getState }) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState() as { userLogin: IUserLoginState };

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.get(`/api/orders`, config);

      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || error.message;

        if (status === 401 || status === 403) {
          // Auth error - admin access required
          const authError: AuthError = {
            message: message || "Admin access required to view all orders",
            code: status === 401 ? "UNAUTHORIZED" : "ACCESS_FORBIDDEN",
            status,
          };
          return rejectWithValue(authError);
        }
      }

      // Generic error or network error
      return rejectWithValue({
        message: "Failed to fetch orders",
        code: "NETWORK_ERROR",
        status: 0,
      } as ApiError);
    }
  }
);

const initialState = {
  loading: "idle",
  orders: [],
  error: undefined,
} as IOrderListMy;

export const orderListSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listOrders.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(listOrders.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.orders = action.payload;
      })
      .addCase(listOrders.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as AuthError | ApiError;
      });
  },
});

export default orderListSlice.reducer;
