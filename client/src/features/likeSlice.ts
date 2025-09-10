import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import ILikeState from "../interfaces/ILikeState";
import { ResourceError, ApiError } from "../types/errors";
import { syncWithLocalStorage } from "../utils/localStorage";

interface IAddToLike {
  id: string;
  qty: number;
}

export const addToLike = createAsyncThunk(
  "cart/addToLike",
  async ({ id, qty }: IAddToLike, { getState, rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);

      dispatch(
        likeSlice.actions.addItemToLike({
          product: data._id,
          name: data.name,
          image: data.image,
          price: data.price,
          countInStock: data.countInStock,
          qty,
        })
      );

      const {
        like: { likeItems },
      } = getState() as { like: ILikeState };
      syncWithLocalStorage("likeItems", likeItems);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || error.message;

        if (status === 404) {
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
        message: "Failed to add item to wishlist",
        code: "NETWORK_ERROR",
        status: 500,
      } as ApiError);
    }
  }
);

const initialState = {
  loading: "idle",
  likeItems: [],
  error: undefined as ResourceError | ApiError | undefined,
} as ILikeState;

export const likeSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToLike: (state, action) => {
      const item = action.payload;

      const existItem = state.likeItems.find((x) => x.product === item.product);

      if (existItem) {
        state.likeItems = state.likeItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.likeItems.push(item);
      }
    },
    removeFromLike: (state, action) => {
      state.likeItems = state.likeItems.filter(
        (x) => x.product !== action.payload
      );

      syncWithLocalStorage("likeItems", state.likeItems);
    },
    resetLike: (state) => {
      state.likeItems = [];
      syncWithLocalStorage("likeItems", []);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToLike.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(addToLike.fulfilled, (state) => {
      state.loading = "succeeded";
    });
    builder.addCase(addToLike.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as ResourceError | ApiError;
    });
  },
});

export const { addItemToLike, removeFromLike } = likeSlice.actions;

export default likeSlice.reducer;
