import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import IOrderDetailsState from '../interfaces/IOrderDetailsState'
import IUserLoginState from '../interfaces/IUserLoginState'

export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
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

      const { data } = await axios.get(`/api/orders/${id}`, config)

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
  loading: 'pending',
  order: {},
  error: undefined,
} as IOrderDetailsState

export const orderDetailsSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.order = action.payload
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export default orderDetailsSlice.reducer
