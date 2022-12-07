import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

const App = () => {
  return (
    <>
      <BrowserRouter>
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
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/like' element={<Like />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/cart/:id' element={<Cart />} />
          <Route path='/:category' element={<Category />} />
          <Route path='/:category/:id' element={<ProductDetails />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
