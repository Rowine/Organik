import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IUserLoginState from "../interfaces/IUserLoginState";
import { ValidationError, AuthError, ResourceError } from "../types/errors";

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
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || error.message;

        if (status === 401 || status === 403) {
          // Auth error
          const authError: AuthError = {
            message: message || "Not authorized to review products",
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
            resourceId: productId,
          };
          return rejectWithValue(resourceError);
        } else {
          // Validation error (invalid rating/comment)
          const validationError: ValidationError = {
            message: message || "Invalid review data",
            code: "VALIDATION_ERROR",
            status: 400,
            field: message.toLowerCase().includes("rating")
              ? "rating"
              : "comment",
          };
          return rejectWithValue(validationError);
        }
      }

      return rejectWithValue({
        message: "Failed to submit review",
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
  error: undefined as ValidationError | AuthError | ResourceError | undefined,
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
        state.error = action.payload as
          | ValidationError
          | AuthError
          | ResourceError;
      });
  },
});

export const { resetProductCreateReview } = productCreateReviewSlice.actions;

export default productCreateReviewSlice.reducer;
