import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IUserLoginState from "../interfaces/IUserLoginState";
import { IUser } from "../interfaces/IUserLoginState";
import { syncWithLocalStorage } from "../utils/localStorage";
import { ApiError, ValidationError } from "../types/errors";

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (user: IUser, { rejectWithValue, getState }) => {
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

      const { data } = await axios.put(`/api/users/profile`, user, config);

      return data;
    } catch (error) {
      let apiError: ApiError | ValidationError = {
        message: "Failed to update profile",
        code: "UPDATE_FAILED",
        status: 400,
      };

      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || error.message;

        if (status === 400) {
          apiError = {
            message,
            code: "VALIDATION_ERROR",
            field: message.toLowerCase().includes("email")
              ? "email"
              : message.toLowerCase().includes("password")
              ? "password"
              : "name",
            status: 400,
          } as ValidationError;
        } else {
          apiError = {
            message:
              message || "An unexpected error occurred during profile update",
            code: status === 401 ? "auth/unauthorized" : "server/error",
            status: status || 500,
          };
        }
      }

      return rejectWithValue(apiError);
    }
  }
);

const initialState = {
  loading: "idle",
  userInfo: {} as IUser,
  error: undefined,
} as IUserLoginState;

export const userUpdateProfileSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.userInfo = action.payload;
        syncWithLocalStorage("userInfo", action.payload);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as ApiError | ValidationError;
      });
  },
});

export default userUpdateProfileSlice.reducer;
