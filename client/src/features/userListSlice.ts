import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IUserListState from "../interfaces/IUserListState";
import IUserLoginState from "../interfaces/IUserLoginState";
import { ApiError } from "../types/errors";

export const listUsers = createAsyncThunk(
  "user/listUsers",
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

      const { data } = await axios.get(`/api/users`, config);

      return data;
    } catch (error: any) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || error.message;

        if (status === 401) {
          const apiError: ApiError = {
            message: "Authentication required",
            code: "UNAUTHORIZED",
            status: 401,
          };
          return rejectWithValue(apiError);
        } else if (status === 403) {
          const apiError: ApiError = {
            message: "Access forbidden",
            code: "ACCESS_FORBIDDEN",
            status: 403,
          };
          return rejectWithValue(apiError);
        } else if (status === 500) {
          const apiError: ApiError = {
            message: "Failed to fetch users",
            code: "SERVER_ERROR",
            status: 500,
          };
          return rejectWithValue(apiError);
        }
      }

      // Generic API error
      const apiError: ApiError = {
        message: error.message || "Failed to fetch users",
        code: "SERVER_ERROR",
        status: 500,
      };
      return rejectWithValue(apiError);
    }
  }
);

const initialState = {
  loading: "idle",
  users: [],
  error: undefined,
} as IUserListState;

export const userListSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userListReset: (state) => {
      state.loading = "idle";
      state.users = [];
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listUsers.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.users = action.payload;
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as ApiError;
      });
  },
});

export const { userListReset } = userListSlice.actions;

export default userListSlice.reducer;
