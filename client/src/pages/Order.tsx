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
    <Container>
      {loading === 'pending' ? (
        <Loader />
      ) : error ? (
        <Message type='error'>{error}</Message>
      ) : (
        <div className='my-10 grid grid-cols-12 gap-x-5'>
          <div className='col-span-12 lg:col-span-8'>
            <div className='rounded-lg bg-white p-5 shadow-lg'>
              <h2 className='mb-5 text-2xl font-semibold'>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p className='mb-2'>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              {order.isDelivered ? (
                <Message type='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message type='error'>Not Delivered</Message>
              )}
            </div>
            <div className='mt-5 rounded-lg bg-white p-5 shadow-lg'>
              <h2 className='mb-5 text-2xl font-semibold'>Payment Method</h2>
              <p className='mb-2'>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message type='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message type='error'>Not Paid</Message>
              )}
            </div>
            <div className='mt-5 rounded-lg bg-white p-5 shadow-lg'>
              <h2 className='mb-5 text-2xl font-semibold'>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message type='info'>Your cart is empty</Message>
              ) : (
                <div className='grid grid-cols-12 gap-x-5 gap-y-3'>
                  {order.orderItems.map((item: any) => (
                    <div
                      key={item.product}
                      className='col-span-12 sm:col-span-6 lg:col-span-4'
                    >
                      <div className='rounded-lg bg-white p-5 shadow-lg'>
                        <div className='flex items-center'>
                          <img
                            src={item.image}
                            alt={item.name}
                            className='h-20 w-20 object-cover'
                          />
                          <div className='ml-5'>
                            <Link
                              to={`/product/${item.product}`}
                              className='text-lg font-semibold hover:underline'
                            >
                              {item.name}
                            </Link>
                            <p className='text-gray-500'>
                              {item.qty} x ₱{item.price} = ₱
                              {item.qty * item.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className='col-span-12 lg:col-span-4'>
            <div className='rounded-lg bg-white p-5 shadow-lg'>
              <h2 className='mb-5 text-2xl font-semibold'>Order Summary</h2>
              <div className='mb-5 flex items-center justify-between'>
                <p>Items</p>
                <p>₱{itemsPriceFixed}</p>
              </div>
              <div className='mb-5 flex items-center justify-between'>
                <p>Shipping</p>
                <p>₱{order.shippingPrice}</p>
              </div>
              <div className='mb-5 flex items-center justify-between'>
                <p>Total</p>
                <p>₱{order.totalPrice}</p>
              </div>
            </div>
            {loadingPay === 'pending' && <Loader />}
            {userInfo && !userInfo.isAdmin && !order.isPaid && (
              <div className='mt-5 rounded-lg bg-white p-5 shadow-lg'>
                <h2 className='mb-5 text-2xl font-semibold'>Payment</h2>
                {errorPay && <Message type='error'>{errorPay}</Message>}
                <div className='mt-10'>
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
                            // Your code here after create the order
                            return orderId
                          })
                      }}
                      onApprove={function (data, actions) {
                        return (actions.order as any)
                          .capture()
                          .then(function (details: any) {
                            // Your code here after capture the order
                            successPaymentHandler(details)
                          })
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              </div>
            )}
            {loadingDeliver === 'pending' && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <div className='mt-5'>
                  <button
                    className='group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
    </Container>
  )
}

export default Order
