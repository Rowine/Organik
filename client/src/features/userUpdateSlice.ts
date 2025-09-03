import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserDetails } from "./userDetailsSlice";
import IUserLoginState from "../interfaces/IUserLoginState";
import { IUser } from "../interfaces/IUserLoginState";
import { ApiError, ValidationError } from "../types/errors";

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (user: IUser, { rejectWithValue, getState, dispatch }) => {
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

      const { data } = await axios.put(`/api/users/${user._id}`, user, config);

      dispatch(getUserDetails(user._id));
      return data;
    } catch (error: any) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || error.message;

        if (status === 400) {
          const validationError: ValidationError = {
            message: "User validation failed",
            code: "VALIDATION_ERROR",
            status: 400,
            field: "user",
          };
          return rejectWithValue(validationError);
        } else if (status === 401) {
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
            status: 401,
          };
          return rejectWithValue(apiError);
        } else if (status === 500) {
          const apiError: ApiError = {
            message: "Failed to update user",
            code: "SERVER_ERROR",
            status: 500,
          };
          return rejectWithValue(apiError);
        }
      }

      // Generic API error
      const apiError: ApiError = {
        message: error.message || "Failed to update user",
        code: "SERVER_ERROR",
        status: 500,
      };
      return rejectWithValue(apiError);
    }
  }
);

const initialState = {
  loading: "idle",
  userInfo: {} as IUser,
  error: undefined,
} as IUserLoginState;

export const userUpdateSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUpdateProfile: (state) => {
      state.loading = "idle";
      state.userInfo = {} as IUser;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = "succeeded";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as ApiError | ValidationError;
      });
  },
});

export const { resetUpdateProfile } = userUpdateSlice.actions;

export default userUpdateSlice.reducer;
