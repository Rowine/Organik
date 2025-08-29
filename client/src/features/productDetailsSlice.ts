import { IReview } from "./../interfaces/IProductItem";
import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IProductDetailsState from "../interfaces/IProductDetailsState";
import IProductItem from "../interfaces/IProductItem";
import { ResourceError } from "../types/errors";

export const listProductDetails = createAsyncThunk(
  "products/listProductDetails",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      return data;
    } catch (error) {
      let apiError: ResourceError = {
        message: "Product not found",
        code: "NOT_FOUND",
        status: 404,
        resourceType: "product",
        resourceId: id,
      };

      if (error instanceof AxiosError && error.response) {
        apiError = {
          message: error.response.data.message || error.message,
          code: error.response.status === 404 ? "NOT_FOUND" : "FORBIDDEN",
          status: error.response.status,
          resourceType: "product",
          resourceId: id,
        };
      }

      return thunkAPI.rejectWithValue(apiError);
    }
  }
);

const initialState = {
  loading: "idle",
  product: {
    reviews: [],
  },
  error: undefined,
} as IProductDetailsState;

export const productDetailsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listProductDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(listProductDetails.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.product = action.payload;
      })
      .addCase(listProductDetails.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as ResourceError;
      });
  },
});

export default productDetailsSlice.reducer;
