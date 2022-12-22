import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import IUserLoginState from '../interfaces/IUserLoginState'

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState() as { userLogin: IUserLoginState }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      }

      const { data } = await axios.delete(`/api/users/${id}`, config)

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
  error: undefined as string | undefined,
}

export const userDeleteSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = 'succeeded'
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export default userDeleteSlice.reducer
