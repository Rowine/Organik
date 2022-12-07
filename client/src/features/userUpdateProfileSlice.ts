import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import IUserLoginState from '../interfaces/IUserLoginState'
import { IUser } from '../interfaces/IUserLoginState'

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (user: IUser, { rejectWithValue, getState }) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState() as { userLogin: IUserLoginState }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      }

      const { data } = await axios.put(`/api/users/profile`, user, config)

      return data
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    }
  }
)

const initialState = {
  loading: 'idle',
  userInfo: {} as IUser,
  error: undefined,
} as IUserLoginState

export const userUpdateProfile = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.userInfo = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export default userUpdateProfile.reducer
