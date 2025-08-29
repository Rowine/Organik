import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IOrderDetailsState from "../interfaces/IOrderDetailsState";
import IUserLoginState from "../interfaces/IUserLoginState";
import { ResourceError, AuthError } from "../types/errors";

export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState() as { userLogin: IUserLoginState };

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.get(`/api/orders/${id}`, config);

      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || error.message;

        if (status === 401 || status === 403) {
          // Auth error
          const authError: AuthError = {
            message: message || "Not authorized to view this order",
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
            resourceId: id,
          };
          return rejectWithValue(resourceError);
        }
      }

      // Generic error
      return rejectWithValue({
        message: "Failed to fetch order details",
        code: "NOT_FOUND",
        status: 500,
        resourceType: "order",
        resourceId: id,
      } as ResourceError);
    }
  }
);

const initialState = {
  loading: "pending",
  order: {},
  error: undefined,
} as IOrderDetailsState;

export const orderDetailsSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as ResourceError | AuthError;
      });
  },
});

export default orderDetailsSlice.reducer;
