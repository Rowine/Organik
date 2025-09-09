import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Link, useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePrices, resetCart } from '../features/cartSlice'
import { createOrder } from '../features/orderSlice'
import { getUserFriendlyMessage } from '../utils/errorUtils'
import {
  CheckCircleIcon,
  TruckIcon,
  CreditCardIcon,
  MapPinIcon,
  ShoppingBagIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'

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
      dispatch(resetCart())
      navigate(`/order/${order?._id}`)
    }
  }, [loading, navigate, order, dispatch])

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
    <div className='bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <CheckoutSteps step1 step2 step3 step4 />

        <div className='grid lg:grid-cols-12 lg:gap-12 mt-8'>
          {/* Main Content - Order Review */}
          <div className='lg:col-span-8 space-y-8'>
            {/* Header */}
            <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200'>
              <div className='flex items-center space-x-3 mb-6'>
                <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                  <CheckCircleIcon className='w-6 h-6 text-green-600' />
                </div>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
                    Review Your Order
                  </h1>
                  <p className='text-gray-600 mt-1'>
                    Almost there! Please review your order before placing it.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200'>
              <div className='flex items-center space-x-3 mb-6'>
                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                  <TruckIcon className='w-5 h-5 text-blue-600' />
                </div>
                <h2 className='text-xl font-semibold text-gray-900'>Shipping Address</h2>
              </div>
              <div className='bg-gray-50 rounded-2xl p-6'>
                <div className='flex items-start space-x-3'>
                  <MapPinIcon className='w-5 h-5 text-gray-400 mt-0.5' />
                  <div>
                    <p className='font-medium text-gray-900'>{shippingAddress.address}</p>
                    <p className='text-gray-600'>
                      {shippingAddress.city}, {shippingAddress.postalCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200'>
              <div className='flex items-center space-x-3 mb-6'>
                <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center'>
                  <CreditCardIcon className='w-5 h-5 text-purple-600' />
                </div>
                <h2 className='text-xl font-semibold text-gray-900'>Payment Method</h2>
              </div>
              <div className='bg-gray-50 rounded-2xl p-6'>
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <CreditCardIcon className='w-4 h-4 text-blue-600' />
                  </div>
                  <div>
                    <p className='font-medium text-gray-900'>{cart.paymentMethod}</p>
                    <p className='text-sm text-gray-600'>Secure payment processing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200'>
              <div className='flex items-center space-x-3 mb-6'>
                <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
                  <ShoppingBagIcon className='w-5 h-5 text-green-600' />
                </div>
                <h2 className='text-xl font-semibold text-gray-900'>Order Items</h2>
              </div>

              {cartItems.length === 0 ? (
                <Message type='info'>Your cart is empty</Message>
              ) : (
                <div className='space-y-4'>
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className='flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl'
                    >
                      <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl'>
                        <img
                          className='h-full w-full object-contain object-center'
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-medium text-gray-900 truncate'>
                          <Link
                            to={`/product/${item.product}`}
                            className='hover:text-green-600 transition-colors'
                          >
                            {item.name}
                          </Link>
                        </h3>
                        <p className='text-sm text-gray-600'>Quantity: {item.qty}</p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium text-gray-900'>₱{item.price}</p>
                        <p className='text-sm text-gray-600'>each</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className='lg:col-span-4 mt-8 lg:mt-0'>
            <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200 sticky top-8'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>
                Order Summary
              </h2>

              <div className='space-y-4 mb-6'>
                <div className='flex justify-between text-gray-600'>
                  <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                  <span>₱{itemsPrice}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                  <span>Shipping</span>
                  <span>{Number(shippingPrice) === 0 ? 'Free' : `₱${shippingPrice}`}</span>
                </div>
                <div className='border-t pt-4'>
                  <div className='flex justify-between text-lg font-bold text-gray-900'>
                    <span>Total</span>
                    <span>₱{totalPrice}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className='mb-6'>
                  <Message type='error'>
                    {typeof error === 'string' ? error + ". Please try again later." :
                      error.code === "UNAUTHORIZED" ? "You need to login" :
                        error.code === "ACCESS_FORBIDDEN" ? "You do not have permission" :
                          error.code === "VALIDATION_ERROR" ? "Please check your order details and try again." :
                            error.code === "INSUFFICIENT_STOCK" ? "Some items are out of stock. Please check availability." :
                              getUserFriendlyMessage(error) + ". Please try again later."}
                  </Message>
                </div>
              )}

              <button
                onClick={placeOrderHandler}
                className='w-full flex justify-center items-center space-x-2 rounded-xl bg-green-600 py-4 px-6 font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              >
                <LockClosedIcon className='w-5 h-5' />
                <span>Place Order</span>
              </button>

              {/* Trust Elements */}
              <div className='mt-6 pt-6 border-t border-gray-200'>
                <div className='space-y-3'>
                  <div className='flex items-center space-x-2 text-sm text-gray-600'>
                    <CheckCircleIcon className='w-4 h-4 text-green-600' />
                    <span>30-day money back guarantee</span>
                  </div>
                  <div className='flex items-center space-x-2 text-sm text-gray-600'>
                    <TruckIcon className='w-4 h-4 text-blue-600' />
                    <span>Free delivery on orders over ₱1,000</span>
                  </div>
                  <div className='flex items-center space-x-2 text-sm text-gray-600'>
                    <LockClosedIcon className='w-4 h-4 text-purple-600' />
                    <span>Secure & encrypted checkout</span>
                  </div>
                </div>
              </div>

              {/* Order Processing Info */}
              <div className='mt-6 pt-6 border-t border-gray-200'>
                <div className='bg-blue-50 rounded-xl p-4'>
                  <h4 className='font-medium text-blue-900 mb-2'>What happens next?</h4>
                  <ul className='text-sm text-blue-800 space-y-1'>
                    <li>• Order confirmation via email</li>
                    <li>• Items prepared for shipping</li>
                    <li>• Tracking information sent</li>
                    <li>• Fresh delivery to your door</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
