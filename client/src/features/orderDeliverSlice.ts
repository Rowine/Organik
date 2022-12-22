import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import IUserLoginState from '../interfaces/IUserLoginState'
import { IOrderItems } from '../interfaces/IOrderDetailsState'

export const deliverOrder = createAsyncThunk(
  'order/deliverOrder',
  async (order: IOrderItems, { rejectWithValue, getState }) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState() as { userLogin: IUserLoginState }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      }

      const { data } = await axios.put(
        `/api/orders/${order._id}/delivered`,
        {},
        config
      )

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
  success: false,
  error: undefined as string | undefined,
}

export const orderDeliverSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    orderDeliverReset: (state) => {
      state.loading = 'idle'
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deliverOrder.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.success = true
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export const { orderDeliverReset } = orderDeliverSlice.actions

export default orderDeliverSlice.reducer
