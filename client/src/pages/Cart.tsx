import React, { useEffect } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../features/cartSlice'

const Cart = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const { cartItems } = useAppSelector((state) => state.cart)

  useEffect(() => {
    if (id) {
      dispatch(addToCart({ id, qty }))
    }
  }, [dispatch, id, qty])

  const removeCartItemHandler = (id: string) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    navigate('/login?redirect=shipping')
  }

  return (
    <div className='min-h-screen'>
      <div className='bg-white'>
        <div className='mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 uppercase pb-10'>
            Shopping Cart
          </h2>
          <div className='grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-10'>
            <div className='flex flex-col md:col-span-2'>
              <div className=''>
                <div className='border-b border-gray-200'>
                  <h3 className='text-sm font-medium text-gray-900'>
                    {cartItems.length} items in your cart
                  </h3>

                  <div className='mt-6'>
                    {cartItems.length === 0 ? (
                      <Message type={'info'}>
                        Your cart is empty.{' '}
                        <Link
                          to='/'
                          className='text-indigo-600 hover:text-indigo-500 underline'
                        >
                          Go back
                        </Link>
                      </Message>
                    ) : (
                      <ul className='border-t border-b border-gray-200 divide-y divide-gray-200'>
                        {cartItems.map((item) => (
                          <li
                            key={item.product}
                            className='py-6 flex space-x-5 sm:space-x-10'
                          >
                            <div className='flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden'>
                              <img
                                src={item.image}
                                alt={item.name}
                                className='w-full h-full object-center object-cover'
                              />
                            </div>

                            <div className='ml-4 flex-1 flex flex-col'>
                              <div className='flex justify-between content-center text-base font-medium text-gray-900'>
                                <h3>
                                  <Link to={`/product/${item.product}`}>
                                    {item.name}
                                  </Link>
                                </h3>
                              </div>
                              <p className='font-semibold my-2'>
                                ₱{item.price}
                              </p>
                            </div>

                            <div className='flex self-center'>
                              <label htmlFor='quantity' className='sr-only'>
                                Quantity
                              </label>
                              <select
                                id='quantity'
                                name='quantity'
                                className='py-2 pl-2 pr-7 border-gray-500 bg-transparent text-gray-500 sm:text-sm rounded-md'
                                defaultValue={item.qty}
                                onChange={(e) =>
                                  dispatch(
                                    addToCart({
                                      id: item.product,
                                      qty: Number(e.target.value),
                                    })
                                  )
                                }
                              >
                                {[...Array(item.countInStock).keys()].map(
                                  (x) => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>

                            <div className='ml-4 flex-shrink-0 flex'>
                              <button
                                type='button'
                                className='font-medium text-red-600 hover:text-red-500'
                                onClick={() =>
                                  removeCartItemHandler(item.product)
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className='border border-gray-50 rounded-md p-4 bg-gray-50'>
                <h2 className='text-lg font-medium text-gray-900'>
                  Order Summary
                </h2>

                <div className=''>
                  <dl className='flex flex-col justify-between mt-6 space-y-4'>
                    <dt className='text-sm font-medium text-gray-500'>
                      Subtotal
                    </dt>
                    <dd className='text-sm font-medium text-gray-900'>
                      ₱
                      {cartItems
                        .reduce((acc, item) => acc + item.qty * item.price, 0)
                        .toFixed(2)}
                    </dd>
                  </dl>
                </div>

                <div className='mt-6'>
                  <button
                    className='w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700'
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Checkout
                  </button>

                  <p className='mt-6 text-center text-sm text-gray-500'>
                    or{' '}
                    <Link
                      to='/'
                      className='text-indigo-600 font-medium hover:text-indigo-500 underline'
                    >
                      Continue Shopping
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
