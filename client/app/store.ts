import { configureStore } from '@reduxjs/toolkit'
import productListSlice from '../src/features/productListSlice'
import productDetailsSlice from '../src/features/productDetailsSlice'

export const store = configureStore({
  reducer: {
    productList: productListSlice,
    productDetails: productDetailsSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: {},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
