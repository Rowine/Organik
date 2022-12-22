import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import IUserListState from '../interfaces/IUserListState'
import IUserLoginState from '../interfaces/IUserLoginState'

export const listUsers = createAsyncThunk(
  'user/listUsers',
  async (thunkAPI, { rejectWithValue, getState }) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState() as { userLogin: IUserLoginState }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      }

      const { data } = await axios.get(`/api/users`, config)

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
  users: [],
  error: undefined,
} as IUserListState

export const userListSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userListReset: (state) => {
      state.loading = 'idle'
      state.users = []
      state.error = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listUsers.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.users = action.payload
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export const { userListReset } = userListSlice.actions

export default userListSlice.reducer
