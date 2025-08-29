import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IUserLoginState from "../interfaces/IUserLoginState";
import { ResourceError, AuthError } from "../types/errors";

export const deleteProduct = createAsyncThunk(
  "order/deleteProduct",
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

      const { data } = await axios.delete(`/api/products/${id}`, config);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || error.message;

        if (status === 401 || status === 403) {
          // Auth error
          const authError: AuthError = {
            message: message || "Not authorized to delete products",
            code: status === 401 ? "UNAUTHORIZED" : "ACCESS_FORBIDDEN",
            status,
          };
          return rejectWithValue(authError);
        } else if (status === 404) {
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

      // Generic error
      return rejectWithValue({
        message: "Failed to delete product",
        code: "NOT_FOUND",
        status: 500,
        resourceType: "product",
        resourceId: id,
      } as ResourceError);
    }
  }
);

const initialState = {
  loading: "idle",
  success: false,
  error: undefined as ResourceError | AuthError | undefined,
};

export const productDeleteSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as ResourceError | AuthError;
      });
  },
});

export default productDeleteSlice.reducer;
