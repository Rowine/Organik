import axios, { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "./userLoginSlice";
import IUserLoginState from "../interfaces/IUserLoginState";
import { syncWithLocalStorage } from "../utils/localStorage";
import { IUser } from "../interfaces/IUserLoginState";
import { ValidationError, ApiError } from "../types/errors";

interface IRegister {
  name: string;
  email: string;
  password: string;
}

export const register = createAsyncThunk(
  "user/register",
  async (
    { name, email, password }: IRegister,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/users",
        { name, email, password },
        config
      );

      dispatch(login({ email, password }));

      syncWithLocalStorage("userInfo", data);

      return data;
    } catch (error) {
      let apiError: ValidationError | ApiError = {
        message: "Registration failed",
        code: "VALIDATION_ERROR",
        field: "email",
        status: 400,
      };

      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        const message = error.response.data.message || error.message;

        if (status === 400) {
          // Validation error - typically email already exists or invalid input
          apiError = {
            message,
            code: "VALIDATION_ERROR",
            field: message.toLowerCase().includes("email")
              ? "email"
              : "password",
            status: 400,
          } as ValidationError;
        } else {
          // Other API errors
          apiError = {
            message:
              message || "An unexpected error occurred during registration",
            code: "SERVER_ERROR",
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
  userInfo: null,
  error: undefined,
} as IUserLoginState;

export const userRegisterSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as ValidationError | ApiError;
      });
  },
});

export default userRegisterSlice.reducer;
