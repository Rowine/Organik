import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import IOrderState from '../interfaces/IOrderState'
import IUserLoginState from '../interfaces/IUserLoginState'
import { ICartItems } from '../interfaces/ICartState'

interface IOrderProps {
  orderItems: ICartItems[]
  shippingAddress: {
    address: string
    city: string
    postalCode: string
  }
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
}

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (order: IOrderProps, { rejectWithValue, getState }) => {
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

      const { data } = await axios.post(`/api/orders`, order, config)

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
  order: {} as IOrderState['order'],
  error: undefined,
} as IOrderState

export const orderCreateSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.order = action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export default orderCreateSlice.reducer
