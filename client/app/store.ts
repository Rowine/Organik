import { configureStore } from '@reduxjs/toolkit'
import productListSlice from '../src/features/productListSlice'
import productDetailsSlice from '../src/features/productDetailsSlice'
import cartSlice from '../src/features/cartSlice'
import IProductItem from '../src/interfaces/IProductItem'
import ICartState from '../src/interfaces/ICartState'

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems') as string)
  : []

const reducer = {
  productList: productListSlice,
  productDetails: productDetailsSlice,
  cart: cartSlice,
}

const preloadedState = {
  cart: {
    loading: 'idle',
    cartItems: cartItemsFromStorage,
    error: undefined,
  } as ICartState,
}

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
