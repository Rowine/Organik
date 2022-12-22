import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUserDetails } from './userDetailsSlice'
import IUserLoginState from '../interfaces/IUserLoginState'
import { IUser } from '../interfaces/IUserLoginState'

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: IUser, { rejectWithValue, getState, dispatch }) => {
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

      const { data } = await axios.put(`/api/users/${user._id}`, user, config)

      dispatch(getUserDetails(user._id))
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

export const userUpdateSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUpdateProfile: (state) => {
      state.loading = 'idle'
      state.userInfo = {} as IUser
      state.error = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = 'succeeded'
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export const { resetUpdateProfile } = userUpdateSlice.actions

export default userUpdateSlice.reducer
