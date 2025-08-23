import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IUserLoginState from "../interfaces/IUserLoginState";

interface ICreateProductReview {
  productId: string;
  review: {
    rating: number;
    comment: string;
  };
}

export const createProductReview = createAsyncThunk(
  "product/createProductReview",
  async (
    { productId, review }: ICreateProductReview,
    { rejectWithValue, getState }
  ) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState() as { userLogin: IUserLoginState };

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/products/${productId}/reviews`,
        review,
        config
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const initialState = {
  loading: "idle",
  success: false,
  error: undefined as string | undefined,
};

export const productCreateReviewSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProductCreateReview: (state) => {
      state.loading = "idle";
      state.success = false;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProductReview.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createProductReview.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.success = true;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetProductCreateReview } = productCreateReviewSlice.actions;

export default productCreateReviewSlice.reducer;
