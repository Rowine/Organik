import orderCreateSlice from './../features/orderSlice'
import { IUser } from '../interfaces/IUserLoginState'
import { configureStore } from '@reduxjs/toolkit'
import productListSlice from '../features/productListSlice'
import productDetailsSlice from '../features/productDetailsSlice'
import cartSlice from '../features/cartSlice'
import userLoginSlice from '../features/userLoginSlice'
import userRegisterSlice from '../features/userRegisterSlice'
import userDetailsSlice from '../features/userDetailsSlice'
import userUpdateProfileSlice from '../features/userUpdateProfileSlice'
import orderDetailsSlice from '../features/orderDetailsSlice'
import orderPaySlice from '../features/orderPaySlice'
import orderListMySlice from '../features/orderListMySlice'
import ICartState from '../interfaces/ICartState'
import IUserLoginState from '../interfaces/IUserLoginState'

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems') as string)
  : []

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo') as string)
  : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress') as string)
  : {}

const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod') as string)
  : ''

const reducer = {
  productList: productListSlice,
  productDetails: productDetailsSlice,
  cart: cartSlice,
  userLogin: userLoginSlice,
  userRegister: userRegisterSlice,
  userDetails: userDetailsSlice,
  userUpdateProfile: userUpdateProfileSlice,
  orderCreate: orderCreateSlice,
  orderDetails: orderDetailsSlice,
  orderPay: orderPaySlice,
  orderListMy: orderListMySlice,
}

const preloadedState = {
  cart: {
    loading: 'idle',
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
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
