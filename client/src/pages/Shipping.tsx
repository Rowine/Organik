import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Container from '../components/Container'
import { saveShippingAddress } from '../features/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'

const Shipping = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { shippingAddress } = useAppSelector((state) => state.cart)

  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
      })
    )
    navigate('/payment')
  }
  return (
    <Container>
      <CheckoutSteps step1 step2 />
      <div className='min-h-screen'>
        <div className='bg-white'>
          <div className='mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 uppercase'>
              Shipping
            </h2>
            <form onSubmit={submitHandler}>
              <div className='mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
                <div className='col-span-2'>
                  <label
                    htmlFor='address'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Address
                  </label>
                  <div className='mt-1'>
                    <input
                      type='text'
                      name='address'
                      id='address'
                      required
                      placeholder='Enter your address'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                    />
                  </div>
                </div>
                <div className='col-span-2'>
                  <label
                    htmlFor='city'
                    className='block text-sm font-medium text-gray-700'
                  >
                    City
                  </label>
                  <div className='mt-1'>
                    <input
                      type='text'
                      name='city'
                      id='city'
                      required
                      placeholder='Enter your city'
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                    />
                  </div>
                </div>
                <div className='col-span-2'>
                  <label
                    htmlFor='postalCode'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Postal Code
                  </label>
                  <div className='mt-1'>
                    <input
                      type='text'
                      name='postalCode'
                      id='postalCode'
                      placeholder='Enter your postal code'
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                    />
                  </div>
                </div>
              </div>
              <div className='mt-6'>
                <button
                  type='submit'
                  className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Shipping
