import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IUserLoginState from "../interfaces/IUserLoginState";
import IProductItem from "../interfaces/IProductItem";
import { ValidationError, AuthError } from "../types/errors";

export const createProduct = createAsyncThunk(
  "product/createProduct",
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

      const { data } = await axios.post(`/api/products`, {}, config);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;

        if (status === 401 || status === 403) {
          // Authentication/Authorization error
          const authError: AuthError = {
            message:
              error.response.data.message ||
              "Not authorized to create products",
            code: status === 401 ? "UNAUTHORIZED" : "ACCESS_FORBIDDEN",
            status,
          };
          return rejectWithValue(authError);
        } else {
          // Validation error
          const validationError: ValidationError = {
            message: error.response.data.message || "Invalid product data",
            code: "VALIDATION_ERROR",
            status: 400,
            field: "name", // Default to name field, server should specify the field
          };
          return rejectWithValue(validationError);
        }
      }

      return rejectWithValue({
        message: "Failed to create product",
        code: "VALIDATION_ERROR",
        status: 400,
        field: "unknown",
      } as ValidationError);
    }
  }
);

const initialState = {
  loading: "idle",
  success: false,
  product: {} as IProductItem,
  error: undefined as ValidationError | AuthError | undefined,
};

export const productCreateSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProductCreate: (state) => {
      state.loading = "idle";
      state.success = false;
      state.product = {} as IProductItem;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.success = true;
        state.product = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as ValidationError | AuthError;
      });
  },
});

export const { resetProductCreate } = productCreateSlice.actions;

export default productCreateSlice.reducer;
