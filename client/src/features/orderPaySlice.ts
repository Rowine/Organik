import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import IOrderPayState from '../interfaces/IOrderPayState'
import IUserLoginState from '../interfaces/IUserLoginState'

export interface IPayOrderProps {
  id: string
  paymentResult: {
    id: string
    status: string
    update_time: string
    email_address: string
  }
}

export const payOrder = createAsyncThunk(
  'order/createOrder',
  async (
    { id, paymentResult }: IPayOrderProps,
    { rejectWithValue, getState }
  ) => {
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

      const { data } = await axios.put(
        `/api/orders/${id}/pay`,
        paymentResult,
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
  error: undefined,
} as IOrderPayState

export const orderPaySlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    payReset: (state) => {
      state.loading = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(payOrder.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loading = 'succeeded'
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export const { payReset } = orderPaySlice.actions

export default orderPaySlice.reducer
