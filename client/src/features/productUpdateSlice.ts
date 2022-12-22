import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import IUserLoginState from '../interfaces/IUserLoginState'
import IProductItem from '../interfaces/IProductItem'

export const updateProduct = createAsyncThunk(
  'order/updateProduct',
  async (product: IProductItem, { rejectWithValue, getState }) => {
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
      console.log(userInfo?.token)

      const { data } = await axios.put(
        `/api/products/${product._id}`,
        product,
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
  product: {} as IProductItem,
  error: undefined as string | undefined,
}

export const productUpdateSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductUpdate: (state) => {
      state.loading = 'idle'
      state.success = false
      state.product = {} as IProductItem
      state.error = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = 'pending'
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.success = true
        state.product = action.payload
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string
      })
  },
})

export const { resetProductUpdate } = productUpdateSlice.actions

export default productUpdateSlice.reducer
