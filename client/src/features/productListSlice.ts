import axios from 'axios'
import { createSlice, createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import IProductListState from '../interfaces/IProductListState'

export const listProducts = createAsyncThunk(
  'products/listProducts',
  async (thunkApi, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products`)

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
  products: [],
  error: undefined,
} as IProductListState

export const productListSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listProducts.pending, (state) => {
        state.loading = 'pending'
        state.products = []
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.products = action.payload
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export default productListSlice.reducer
