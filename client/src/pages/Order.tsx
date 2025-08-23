import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import Message from '../components/Message'
import Container from '../components/Container'
import Loader from '../components/Loader'
import { getOrderDetails } from '../features/orderDetailsSlice'
import { payOrder, IPayOrderProps, payReset } from '../features/orderPaySlice'
import { orderDeliverReset, deliverOrder } from '../features/orderDeliverSlice'
import {
  TruckIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface IPayOrderPayload {
  id: string
  paymentResult: {
    id: string
    status: string
    update_time: string
    email_address: string
  }
}

const Order = () => {
  const [clientId, setClientId] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams() as { id: string }

  const orderDetails = useAppSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useAppSelector((state) => state.orderPay)
  const { loading: loadingPay, error: errorPay } = orderPay

  const orderDeliver = useAppSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const { userInfo } = useAppSelector((state) => state.userLogin)

  const addDecimal = (num: number) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  const itemsPrice = order.orderItems
    ? order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    : 0

  const itemsPriceFixed = itemsPrice ? addDecimal(itemsPrice) : 0

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }
    if (
      !order ||
      order._id !== id ||
      loadingPay === 'succeeded' ||
      successDeliver
    ) {
      dispatch(payReset())
      dispatch(orderDeliverReset())
      dispatch(getOrderDetails(id))
    }
  }, [dispatch, id, order, loadingPay, successDeliver])

  const successPaymentHandler = (paymentResult: any) => {
    dispatch(payOrder({ id, paymentResult } as IPayOrderProps))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

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
    <main className='flex-grow bg-gradient-to-br from-gray-50 via-white to-gray-50'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        {loading === 'pending' ? (
          <div className='flex min-h-[400px] items-center justify-center'>
            <Loader />
          </div>
        ) : error ? (
          <Message type='error'>{error}</Message>
        ) : (
          <div className='grid lg:grid-cols-12 lg:gap-x-12'>
            {/* Main Content Section */}
            <div className='lg:col-span-8'>
              {/* Shipping Information */}
              <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200 mb-8'>
                <div className='flex items-center mb-6'>
                  <div className='h-12 w-12 flex items-center justify-center rounded-full bg-green-100'>
                    <TruckIcon className='h-6 w-6 text-green-600' />
                  </div>
                  <div className='ml-4'>
                    <h2 className='text-2xl font-bold tracking-tight text-gray-900'>Shipping Details</h2>
                    <p className='text-sm text-gray-600'>Delivery information and tracking</p>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='rounded-2xl bg-gray-50 p-4'>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                      <div>
                        <p className='text-sm font-medium text-gray-500'>Shipping Address</p>
                        <p className='mt-1 text-sm text-gray-900'>
                          {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                          {order.shippingAddress.postalCode}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-500'>Customer Details</p>
                        <p className='mt-1 text-sm text-gray-900'>{order.user.name}</p>
                        <a href={`mailto:${order.user.email}`} className='text-sm text-green-600 hover:text-green-500'>
                          {order.user.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center space-x-2'>
                    {order.isDelivered ? (
                      <>
                        <CheckCircleIcon className='h-5 w-5 text-green-500' />
                        <span className='text-sm font-medium text-green-600'>
                          Delivered on {order.deliveredAt}
                        </span>
                      </>
                    ) : (
                      <>
                        <ClockIcon className='h-5 w-5 text-yellow-500' />
                        <span className='text-sm font-medium text-yellow-600'>
                          Pending Delivery
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200 mb-8'>
                <div className='flex items-center mb-6'>
                  <div className='h-12 w-12 flex items-center justify-center rounded-full bg-green-100'>
                    <CreditCardIcon className='h-6 w-6 text-green-600' />
                  </div>
                  <div className='ml-4'>
                    <h2 className='text-2xl font-bold tracking-tight text-gray-900'>Payment Details</h2>
                    <p className='text-sm text-gray-600'>Transaction information</p>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='rounded-2xl bg-gray-50 p-4'>
                    <p className='text-sm font-medium text-gray-500'>Payment Method</p>
                    <p className='mt-1 text-sm text-gray-900'>{order.paymentMethod}</p>
                  </div>

                  <div className='flex items-center space-x-2'>
                    {order.isPaid ? (
                      <>
                        <CheckCircleIcon className='h-5 w-5 text-green-500' />
                        <span className='text-sm font-medium text-green-600'>
                          Paid on {order.paidAt}
                        </span>
                      </>
                    ) : (
                      <>
                        <XMarkIcon className='h-5 w-5 text-red-500' />
                        <span className='text-sm font-medium text-red-600'>
                          Payment Pending
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200'>
                <div className='flex items-center mb-6'>
                  <div className='h-12 w-12 flex items-center justify-center rounded-full bg-green-100'>
                    <ShoppingBagIcon className='h-6 w-6 text-green-600' />
                  </div>
                  <div className='ml-4'>
                    <h2 className='text-2xl font-bold tracking-tight text-gray-900'>Order Items</h2>
                    <p className='text-sm text-gray-600'>Products in your order</p>
                  </div>
                </div>

                {order.orderItems.length === 0 ? (
                  <Message type='info'>Your cart is empty</Message>
                ) : (
                  <div className='space-y-4'>
                    {order.orderItems.map((item: any) => (
                      <div
                        key={item.product}
                        className='rounded-2xl border border-gray-200 p-4 hover:shadow-lg transition-shadow'
                      >
                        <div className='flex items-center space-x-4'>
                          <img
                            src={item.image}
                            alt={item.name}
                            className='h-24 w-24 rounded-xl object-cover'
                          />
                          <div className='flex-1 min-w-0'>
                            <Link
                              to={`/product/${item.product}`}
                              className='text-lg font-medium text-gray-900 hover:text-green-600 truncate block'
                            >
                              {item.name}
                            </Link>
                            <p className='text-sm text-gray-500 mt-1'>
                              Quantity: {item.qty}
                            </p>
                          </div>
                          <div className='text-right'>
                            <p className='text-lg font-bold text-green-600'>₱{item.qty * item.price}</p>
                            <p className='text-sm text-gray-500'>₱{item.price} each</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Section */}
            <div className='lg:col-span-4 mt-8 lg:mt-0'>
              <div className='sticky top-8 space-y-8'>
                <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200'>
                  <h2 className='text-2xl font-bold tracking-tight text-gray-900 mb-6'>Order Summary</h2>
                  <div className='space-y-4'>
                    <div className='flex justify-between items-center py-2'>
                      <span className='text-gray-600'>Items Total</span>
                      <span className='text-lg font-medium text-gray-900'>₱{itemsPriceFixed}</span>
                    </div>
                    <div className='flex justify-between items-center py-2'>
                      <span className='text-gray-600'>Shipping Fee</span>
                      <span className='text-lg font-medium text-gray-900'>₱{order.shippingPrice}</span>
                    </div>
                    <div className='border-t border-gray-200 pt-4'>
                      <div className='flex justify-between items-center'>
                        <span className='text-lg font-bold text-gray-900'>Total</span>
                        <span className='text-xl font-bold text-green-600'>₱{order.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {loadingPay === 'pending' && <Loader />}
                {userInfo && !userInfo.isAdmin && !order.isPaid && (
                  <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200'>
                    <h2 className='text-2xl font-bold tracking-tight text-gray-900 mb-6'>Payment</h2>
                    {errorPay && <Message type='error'>{errorPay}</Message>}
                    <PayPalScriptProvider
                      options={{
                        'client-id': clientId,
                        currency: 'PHP',
                      }}
                    >
                      <PayPalButtons
                        disabled={false}
                        createOrder={(data, actions) => {
                          return actions.order
                            .create({
                              purchase_units: [
                                {
                                  amount: {
                                    currency_code: 'PHP',
                                    value: order.totalPrice.toString(),
                                  },
                                },
                              ],
                            })
                            .then((orderId) => {
                              return orderId
                            })
                        }}
                        onApprove={function (data, actions) {
                          return (actions.order as any)
                            .capture()
                            .then(function (details: any) {
                              successPaymentHandler(details)
                            })
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                )}

                {loadingDeliver === 'pending' && <Loader />}
                {userInfo &&
                  userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <button
                      onClick={deliverHandler}
                      className='w-full flex justify-center items-center space-x-2 rounded-xl bg-green-600 py-3 px-6 font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                    >
                      <TruckIcon className='h-5 w-5' />
                      <span>Mark As Delivered</span>
                    </button>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Order
