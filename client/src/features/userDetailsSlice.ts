import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "./userLoginSlice";
import IUserLoginState from "../interfaces/IUserLoginState";
import { IUser } from "./../interfaces/IUserLoginState";
import IUserDetailsState from "../interfaces/IUserDetailsState";
import { ApiError, AuthError } from "../types/errors";

export const getUserDetails = createAsyncThunk(
  "user/details",
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState() as { userLogin: IUserLoginState };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.get(`/api/users/${id}`, config);

      return data;
    } catch (error) {
      let apiError: ApiError = {
        message: "Failed to fetch user details",
        code: "UNAUTHORIZED",
        status: 401,
      };

      if (error instanceof AxiosError) {
        if (error.response) {
          apiError = {
            message: error.response.data.message || error.message,
            code:
              error.response.status === 401
                ? "UNAUTHORIZED"
                : "ACCESS_FORBIDDEN",
            status: error.response.status,
          };
        } else if (error.request) {
          const networkError: ApiError = {
            message: "Network error while fetching user details",
            code: "NETWORK_ERROR",
            status: 0,
          };
          apiError = networkError;
        }
      }

      return rejectWithValue(apiError);
    }
  }
);

const initialState = {
  loading: "idle",
  user: {} as IUser,
  error: undefined,
} as IUserDetailsState;

export const userDetailsSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserDetails: (state) => {
      state.loading = "idle";
      state.user = {} as IUser;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.user = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as ApiError;
      });
  },
});

export const { resetUserDetails } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;
