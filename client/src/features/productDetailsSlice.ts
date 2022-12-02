import axios from 'axios'
import { createSlice, createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import IProductDetailsState from '../interfaces/IProductDetailsState'

export const listProductDetails = createAsyncThunk(
  'products/listProductDetails',
  async (id: string, thunkAPI) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`)
      return data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    }
  }
)

const initialState = {
  loading: 'idle',
  product: {
    reviews: [],
  },
  error: undefined,
} as IProductDetailsState

export const productDetailsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listProductDetails.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(listProductDetails.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.product = action.payload
      })
      .addCase(listProductDetails.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export default productDetailsSlice.reducer
