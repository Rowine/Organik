import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login } from './userLoginSlice'
import IUserLoginState from '../interfaces/IUserLoginState'
import { IUser } from '../interfaces/IUserLoginState'

interface IRegister {
  name: string
  email: string
  password: string
}

export const register = createAsyncThunk(
  'user/register',
  async (
    { name, email, password }: IRegister,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.post(
        '/api/users',
        { name, email, password },
        config
      )

      dispatch(login({ email, password }))

      localStorage.setItem('userInfo', JSON.stringify(data))

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
  userInfo: null,
  error: undefined,
} as IUserLoginState

export const userRegisterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.userInfo = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export default userRegisterSlice.reducer
