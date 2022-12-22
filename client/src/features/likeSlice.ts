import axios from 'axios'
import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import ILikeState from '../interfaces/ILikeState'

interface IAddToLike {
  id: string
  qty: number
}

export const addToLike = createAsyncThunk(
  'cart/addToLike',
  async ({ id, qty }: IAddToLike, { getState, rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`)

      dispatch(
        likeSlice.actions.addItemToLike({
          product: data._id,
          name: data.name,
          image: data.image,
          price: data.price,
          countInStock: data.countInStock,
          qty,
        })
      )

      const {
        like: { likeItems },
      } = getState() as { like: ILikeState }
      localStorage.setItem('likeItems', JSON.stringify(likeItems))
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
  likeItems: [],
  error: undefined as string | undefined,
} as ILikeState

export const likeSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToLike: (state, action) => {
      const item = action.payload

      const existItem = state.likeItems.find((x) => x.product === item.product)

      if (existItem) {
        state.likeItems = state.likeItems.map((x) =>
          x.product === existItem.product ? item : x
        )
      } else {
        state.likeItems.push(item)
      }
    },
    removeFromLike: (state, action) => {
      state.likeItems = state.likeItems.filter(
        (x) => x.product !== action.payload
      )

      localStorage.setItem('likeItems', JSON.stringify(state.likeItems))
    },
    resetLike: (state) => {
      state.likeItems = []
      localStorage.removeItem('cartItems')
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToLike.pending, (state) => {
      state.loading = 'pending'
    })
    builder.addCase(addToLike.fulfilled, (state) => {
      state.loading = 'succeeded'
    })
    builder.addCase(addToLike.rejected, (state, action) => {
      state.loading = 'failed'
      state.error = action.payload as string
    })
  },
})

export const { addItemToLike, removeFromLike } = likeSlice.actions

export default likeSlice.reducer
