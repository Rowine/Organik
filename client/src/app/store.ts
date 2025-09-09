import orderCreateSlice from "./../features/orderSlice";
import { configureStore } from "@reduxjs/toolkit";
import productListSlice from "../features/productListSlice";
import productDetailsSlice from "../features/productDetailsSlice";
import productDeleteSlice from "../features/productDeleteSlice";
import productCreateSlice from "../features/productCreateSlice";
import productUpdateSlice from "../features/productUpdateSlice";
import productCreateReviewSlice from "../features/productCreateReviewSlice";
import cartSlice from "../features/cartSlice";
import likeSlice from "../features/likeSlice";
import userLoginSlice from "../features/userLoginSlice";
import userRegisterSlice from "../features/userRegisterSlice";
import userDetailsSlice from "../features/userDetailsSlice";
import userUpdateProfileSlice from "../features/userUpdateProfileSlice";
import userUpdateSlice from "../features/userUpdateSlice";
import orderDetailsSlice from "../features/orderDetailsSlice";
import orderPaySlice from "../features/orderPaySlice";
import orderListMySlice from "../features/orderListMySlice";
import orderListSlice from "../features/orderListSlice";
import orderDeliver from "../features/orderDeliverSlice";
import userListSlice from "../features/userListSlice";
import userDeleteSlice from "../features/userDeleteSlice";
import ICartState from "../interfaces/ICartState";
import IUserLoginState from "../interfaces/IUserLoginState";
import { useLocalStorage } from "../hooks/useLocalStorage";

const reducer = {
  productList: productListSlice,
  productDetails: productDetailsSlice,
  productDelete: productDeleteSlice,
  productCreate: productCreateSlice,
  productUpdate: productUpdateSlice,
  productCreateReview: productCreateReviewSlice,
  cart: cartSlice,
  like: likeSlice,
  userLogin: userLoginSlice,
  userRegister: userRegisterSlice,
  userDetails: userDetailsSlice,
  userUpdateProfile: userUpdateProfileSlice,
  userList: userListSlice,
  userDelete: userDeleteSlice,
  userUpdate: userUpdateSlice,
  orderCreate: orderCreateSlice,
  orderDetails: orderDetailsSlice,
  orderPay: orderPaySlice,
  orderListMy: orderListMySlice,
  orderList: orderListSlice,
  orderDeliver: orderDeliver,
};

import { initializeLocalStorageValues } from "../utils/localStorage";

const localStorageValues = initializeLocalStorageValues();

const preloadedState = {
  cart: {
    loading: "idle",
    cartItems: localStorageValues.cartItems,
    shippingAddress: localStorageValues.shippingAddress,
    paymentMethod: localStorageValues.paymentMethod,
    error: undefined,
  } as ICartState,
  userLogin: {
    loading: "idle",
    userInfo: localStorageValues.userInfo,
    error: undefined,
  } as IUserLoginState,
};

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== "production",
  preloadedState,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export {
  syncWithLocalStorage,
  clearStoreLocalStorage,
} from "../utils/localStorage";
