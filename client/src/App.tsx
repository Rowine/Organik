import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Category from './pages/Category'

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
          <Route path='/:category' element={<Category />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
