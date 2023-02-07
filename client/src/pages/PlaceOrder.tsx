import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Link, useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import Container from '../components/Container'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePrices } from '../features/cartSlice'
import { createOrder } from '../features/orderSlice'

const PlaceOrder = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const cart = useAppSelector((state) => state.cart)
  const { cartItems, shippingAddress } = cart

  const orderCreate = useAppSelector((state) => state.orderCreate)
  const { order, loading, error } = orderCreate

  // Calculate prices
  const addDecimals = (num: number) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  const itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  const shippingPrice = addDecimals(Number(itemsPrice) > 100 ? 0 : 100)
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice)).toFixed(2)
  dispatch(savePrices({ itemsPrice, shippingPrice, totalPrice }))

  useEffect(() => {
    if (loading === 'succeeded') {
      navigate(`/order/${order?._id}`)
    }
  }, [loading, navigate, order])

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: Number(itemsPrice),
        shippingPrice: Number(shippingPrice),
        totalPrice: Number(totalPrice),
      })
    )
  }
  return (
    <Container>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className='my-10 grid grid-cols-12 gap-x-5 gap-y-10'>
        <div className='col-span-12 lg:col-span-8'>
          <div className='rounded-lg bg-white p-5 shadow-lg'>
            <h2 className='mb-5 font-lato text-2xl font-semibold'>Shipping</h2>
            <p>
              <strong>Address: </strong>
              {shippingAddress.address}, {shippingAddress.city}{' '}
              {shippingAddress.postalCode}
            </p>

            <h2 className='mt-5 mb-5 font-lato text-2xl font-semibold'>
              Payment Method
            </h2>
            <p>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </p>

            <h2 className='mt-5 mb-5 font-lato text-2xl font-semibold'>
              Order Items
            </h2>
            {cartItems.length === 0 ? (
              <Message type='info'>Your cart is empty</Message>
            ) : (
              <ul className='divide-y divide-gray-200'>
                {cartItems.map((item, index) => (
                  <li key={index} className='py-5'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0'>
                        <img
                          className='h-12 w-12 rounded-lg object-cover'
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                      <div className='ml-4 flex flex-1 flex-col'>
                        <div>
                          <div className='flex justify-between text-base font-medium text-gray-900'>
                            <h3>
                              <Link to={`/product/₱{item.product}`}>
                                {item.name}
                              </Link>
                            </h3>
                            <p className='ml-4'>₱{item.price}</p>
                          </div>
                          <p className='mt-1 text-sm text-gray-500'>
                            Qty: {item.qty}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className='col-span-12 lg:col-span-4'>
          <div className='rounded-lg bg-white p-5 shadow-lg'>
            <h2 className='mb-5 font-lato text-2xl font-semibold'>
              Order Summary
            </h2>
            <ul className='divide-y divide-gray-200'>
              <li className='py-5'>
                <div className='flex justify-between text-base font-medium text-gray-900'>
                  <p>Items</p>
                  <p>₱{itemsPrice}</p>
                </div>
              </li>
              <li className='py-5'>
                <div className='flex justify-between text-base font-medium text-gray-900'>
                  <p>Shipping</p>
                  <p>₱{shippingPrice}</p>
                </div>
              </li>
              <li className='py-5'>
                <div className='flex justify-between text-base font-medium text-gray-900'>
                  <p>Total</p>
                  <p>₱{totalPrice}</p>
                </div>
              </li>
            </ul>
            {error && <Message type='error'>{error}</Message>}
            <button
              onClick={placeOrderHandler}
              className='mt-5 flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default PlaceOrder
