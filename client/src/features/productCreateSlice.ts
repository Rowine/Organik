import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import IUserLoginState from '../interfaces/IUserLoginState'
import IProductItem from '../interfaces/IProductItem'

export const createProduct = createAsyncThunk(
  'product/createProduct',
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

      const { data } = await axios.post(`/api/products`, {}, config)
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
  product: {} as IProductItem,
  error: undefined as string | undefined,
}

export const productCreateSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductCreate: (state) => {
      state.loading = 'idle'
      state.success = false
      state.product = {} as IProductItem
      state.error = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.success = true
        state.product = action.payload
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export const { resetProductCreate } = productCreateSlice.actions

export default productCreateSlice.reducer
