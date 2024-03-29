import axios from 'axios'
import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import ICartState from '../interfaces/ICartState'

interface IAddToCart {
  id: string
  qty: number
}

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ id, qty }: IAddToCart, { getState, rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`)

      dispatch(
        cartSlice.actions.addToCart({
          product: data._id,
          name: data.name,
          image: data.image,
          price: data.price,
          countInStock: data.countInStock,
          qty,
        })
      )

      const {
        cart: { cartItems },
      } = getState() as { cart: ICartState }
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
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
  cartItems: [],
  shippingAddress: {
    address: '',
    city: '',
    postalCode: '',
  },
  paymentMethod: '',
  itemsPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  error: undefined,
} as ICartState

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload

      const existItem = state.cartItems.find((x) => x.product === item.product)

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        )
      } else {
        state.cartItems.push(item)
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== action.payload
      )

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload

      localStorage.setItem(
        'shippingAddress',
        JSON.stringify(state.shippingAddress)
      )
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload

      localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod))
    },
    savePrices: (state, action) => {
      state.itemsPrice = action.payload.itemsPrice
      state.shippingPrice = action.payload.shippingPrice
      state.totalPrice = action.payload.totalPrice
    },
    resetCart: (state) => {
      state.cartItems = []
      localStorage.removeItem('cartItems')
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state) => {
      state.loading = 'pending'
    })
    builder.addCase(addToCart.fulfilled, (state) => {
      state.loading = 'idle'
    })
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = 'idle'
      state.error = action.payload as string
    })
  },
})

export const {
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  savePrices,
  resetCart,
} = cartSlice.actions

export default cartSlice.reducer
