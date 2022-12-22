import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import IOrderListMy from '../interfaces/IOrderListMy'
import IUserLoginState from '../interfaces/IUserLoginState'

export const listOrders = createAsyncThunk(
  'order/listOrders',
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

      const { data } = await axios.get(`/api/orders`, config)

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
  orders: [],
  error: undefined,
} as IOrderListMy

export const orderListSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listOrders.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(listOrders.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.orders = action.payload
      })
      .addCase(listOrders.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export default orderListSlice.reducer
