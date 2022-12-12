import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import IOrderListMy from '../interfaces/IOrderListMy'
import IUserLoginState from '../interfaces/IUserLoginState'

export const listMyOrders = createAsyncThunk(
  'order/listMyOrders',
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

      const { data } = await axios.get(`/api/orders/myorders`, config)

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

export const orderListMySlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderListMy: (state) => {
      state.loading = 'idle'
      state.orders = []
      state.error = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listMyOrders.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(listMyOrders.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.orders = action.payload
      })
      .addCase(listMyOrders.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export const { resetOrderListMy } = orderListMySlice.actions

export default orderListMySlice.reducer
