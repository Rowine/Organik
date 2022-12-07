import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login } from './userLoginSlice'
import IUserLoginState from '../interfaces/IUserLoginState'
import { IUser } from './../interfaces/IUserLoginState'
import IUserDetailsState from '../interfaces/IUserDetailsState'

export const getUserDetails = createAsyncThunk(
  'user/details',
  async (id: string, { rejectWithValue, getState }) => {
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

      const { data } = await axios.get(`/api/users/${id}`, config)

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
  user: {} as IUser,
  error: undefined,
} as IUserDetailsState

export const userDetailsSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.user = action.payload
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export default userDetailsSlice.reducer
