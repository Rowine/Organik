import { IUser } from './../src/interfaces/IUserLoginState'
import { configureStore } from '@reduxjs/toolkit'
import productListSlice from '../src/features/productListSlice'
import productDetailsSlice from '../src/features/productDetailsSlice'
import cartSlice from '../src/features/cartSlice'
import userLoginSlice from '../src/features/userLoginSlice'
import userRegisterSlice from '../src/features/userRegisterSlice'
import userDetailsSlice from '../src/features/userDetailsSlice'
import userUpdateProfileSlice from '../src/features/userUpdateProfileSlice'
import ICartState from '../src/interfaces/ICartState'
import IUserLoginState from '../src/interfaces/IUserLoginState'

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems') as string)
  : []

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo') as string)
  : null

const reducer = {
  productList: productListSlice,
  productDetails: productDetailsSlice,
  cart: cartSlice,
  userLogin: userLoginSlice,
  userRegister: userRegisterSlice,
  userDetails: userDetailsSlice,
  userUpdateProfile: userUpdateProfileSlice,
}

const preloadedState = {
  cart: {
    loading: 'idle',
    cartItems: cartItemsFromStorage,
    error: undefined,
  } as ICartState,
  userLogin: {
    loading: 'idle',
    userInfo: userInfoFromStorage,
    error: undefined,
  } as IUserLoginState,
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
