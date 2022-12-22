import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import IUserLoginState from '../interfaces/IUserLoginState'

export const deleteProduct = createAsyncThunk(
  'order/deleteProduct',
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

      const { data } = await axios.delete(`/api/products/${id}`, config)
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

export const productDeleteSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.success = true
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export default productDeleteSlice.reducer
