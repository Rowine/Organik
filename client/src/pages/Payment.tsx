import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Container from '../components/Container'
import { savePaymentMethod } from '../features/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'

const Payment = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { shippingAddress } = useAppSelector((state) => state.cart)

  if (!shippingAddress) {
    navigate('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('Paypal')

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder')
  }
  return (
    <Container>
      <CheckoutSteps step1 step2 step3 />
      <div className='min-h-screen'>
        <div className='bg-white'>
          <div className='mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 uppercase'>
              Payment Method
            </h2>
            <form onSubmit={submitHandler}>
              <div className='mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
                <div className='col-span-2'>
                  <label
                    htmlFor='address'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Select Method
                  </label>
                  <div className='mt-1'>
                    <select
                      id='paymentMethod'
                      name='paymentMethod'
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                    >
                      <option value='PayPal'>Paypal or Credit Card</option>
                    </select>
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

export default Payment
