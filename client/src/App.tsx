import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useEffect, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import axios from 'axios'
import Loader from './components/Loader'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Category from './pages/Category'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Like from './pages/Like'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Shipping from './pages/Shipping'
import Payment from './pages/Payment'
import PlaceOrder from './pages/PlaceOrder'
import Order from './pages/Order'
import UserList from './pages/UserList'
import UserEdit from './pages/UserEdit'
import ProductList from './pages/ProductList'
import ProductEdit from './pages/ProductEdit'
import OrderList from './pages/OrderList'

const App = () => {
  return (
    <HelmetProvider>
      <BrowserRouter basename='/'>
        <div className='flex h-screen flex-col justify-between'>
          <Navigation
            category={[
              {
                name: 'Meat',
                path: '/meat',
                active: false,
              },
              {
                name: 'Fish',
                path: '/fish',
                active: false,
              },
              {
                name: 'Vegetables',
                path: '/vegetables',
                active: false,
              },
              {
                name: 'Fruits',
                path: '/fruits',
                active: false,
              },
            ]}
          />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/order/:id' element={<Order />} />
            <Route path='/shipping' element={<Shipping />} />
            <Route path='/payment' element={<Payment />} />
            <Route path='/placeorder' element={<PlaceOrder />} />
            <Route path='/register' element={<Register />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/like' element={<Like />} />
            <Route path='/like/:id' element={<Like />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/cart/:id' element={<Cart />} />
            <Route path='/admin/userlist' element={<UserList />} />
            <Route path='/admin/productlist' element={<ProductList />} />
            <Route path='/admin/orderlist' element={<OrderList />} />
            <Route path='/admin/user/:id/edit' element={<UserEdit />} />
            <Route path='/admin/product/:id/edit' element={<ProductEdit />} />
            <Route path='/:category' element={<Category />} />
            <Route path='/:category/:id' element={<ProductDetails />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
