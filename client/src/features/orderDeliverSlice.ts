import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IUserLoginState from "../interfaces/IUserLoginState";
import { IOrderItems } from "../interfaces/IOrderDetailsState";
import { ResourceError, AuthError } from "../types/errors";

export const deliverOrder = createAsyncThunk(
  "order/deliverOrder",
  async (order: IOrderItems, { rejectWithValue, getState }) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState() as { userLogin: IUserLoginState };

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/orders/${order._id}/delivered`,
        {},
        config
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || error.message;

        if (status === 401 || status === 403) {
          // Auth error - admin access required
          const authError: AuthError = {
            message: message || "Admin access required to deliver orders",
            code: status === 401 ? "UNAUTHORIZED" : "ACCESS_FORBIDDEN",
            status,
          };
          return rejectWithValue(authError);
        } else if (status === 404) {
          // Order not found
          const resourceError: ResourceError = {
            message: "Order not found",
            code: "NOT_FOUND",
            status: 404,
            resourceType: "order",
            resourceId: order._id,
          };
          return rejectWithValue(resourceError);
        }
      }

      // Generic error
      return rejectWithValue({
        message: "Failed to deliver order",
        code: "NOT_FOUND",
        status: 500,
        resourceType: "order",
        resourceId: order._id,
      } as ResourceError);
    }
  }
);

const initialState = {
  loading: "idle",
  success: false,
  error: undefined as ResourceError | AuthError | undefined,
};

export const orderDeliverSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    orderDeliverReset: (state) => {
      state.loading = "idle";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deliverOrder.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.success = true;
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as ResourceError | AuthError;
      });
  },
});

export const { orderDeliverReset } = orderDeliverSlice.actions;

export default orderDeliverSlice.reducer;
