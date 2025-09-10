import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IUserLoginState, { IUser } from "../interfaces/IUserLoginState";
import { ApiError, AuthError } from "../types/errors";
import { syncWithLocalStorage } from "../utils/localStorage";

interface ILogin {
  email: string;
  password: string;
}

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }: ILogin, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/users/login",
        { email, password },
        config
      );

      syncWithLocalStorage("userInfo", data);

      return data;
    } catch (error) {
      let apiError: ApiError = {
        message: "An unexpected error occurred",
        code: "NETWORK_ERROR",
        status: 500,
      };

      if (error instanceof AxiosError) {
        if (error.response) {
          // Server responded with an error status
          const authError: AuthError = {
            message: error.response.data.message || error.message,
            code:
              error.response.status === 401
                ? "INVALID_CREDENTIALS"
                : "UNAUTHORIZED",
            status: error.response.status,
          };
          apiError = authError;
        } else if (error.request) {
          // Request was made but no response received (network error)
          apiError = {
            message: "Please check your internet connection and try again",
            code: "NETWORK_ERROR",
            status: 0,
          };
        } else {
          // Something else happened
          apiError = {
            message: error.message || "An unexpected error occurred",
            code: "NETWORK_ERROR",
            status: 0,
          };
        }
      }

      return rejectWithValue(apiError);
    }
  }
);

const initialState: IUserLoginState = {
  loading: "idle",
  userInfo: null,
  error: undefined,
};

export const userLoginSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      syncWithLocalStorage("userInfo", null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as AuthError;
      });
  },
});

export const { logout } = userLoginSlice.actions;

export default userLoginSlice.reducer;
