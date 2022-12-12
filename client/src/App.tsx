import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from './components/Loader'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Category from './pages/Category'
import ProductDetails from './pages/ProductDetails'
import Like from './pages/Like'
import Cart from './pages/Cart'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Shipping from './pages/Shipping'
import Payment from './pages/Payment'
import PlaceOrder from './pages/PlaceOrder'
import Order from './pages/Order'

const App = () => {
  const [clientId, setClientId] = useState(null)

  useEffect(() => {
    try {
      const addPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/config/paypal')
        setClientId(clientId)
      }
      addPaypalScript()
    } catch (error) {
      console.log('Error')
    }
  }, [clientId])

  return (
    <>
      <BrowserRouter>
        {!clientId ? (
          <Loader />
        ) : (
          <PayPalScriptProvider
            options={{
              'client-id': clientId,
              currency: 'PHP',
            }}
          >
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
              <Route path='/cart' element={<Cart />} />
              <Route path='/cart/:id' element={<Cart />} />
              <Route path='/:category' element={<Category />} />
              <Route path='/:category/:id' element={<ProductDetails />} />
            </Routes>
            <Footer />
          </PayPalScriptProvider>
        )}
      </BrowserRouter>
    </>
  )
}

export default App
