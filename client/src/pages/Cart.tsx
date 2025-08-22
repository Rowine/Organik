import React, { useEffect } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../features/cartSlice'
import {
  ShoppingCartIcon,
  ArrowLeftIcon,
  LockClosedIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

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
    navigate('/login?redirect=/shipping')
  }

  const EmptyState = () => (
    <div className='text-center py-16'>
      <div className='mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6'>
        <ShoppingCartIcon className="w-12 h-12 text-blue-500" />
      </div>
      <h3 className='text-2xl font-bold text-gray-900 mb-2'>Your cart is empty</h3>
      <p className='text-gray-600 mb-8 max-w-md mx-auto'>
        Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
      </p>
      <Link
        to="/"
        className='inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-500 transition-colors'
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Start Shopping
      </Link>
    </div>
  )



  const OrderSummary = () => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
    const shipping = subtotal > 1000 ? 0 : 50
    const total = subtotal + shipping

    return (
      <div className='rounded-3xl bg-white p-6 shadow-lg ring-1 ring-gray-200 sticky top-8'>
        <h2 className='text-xl font-bold text-gray-900 mb-6'>Order Summary</h2>

        <div className='space-y-4'>
          <div className='flex justify-between text-gray-600'>
            <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>

          <div className='flex justify-between text-gray-600'>
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `₱${shipping.toFixed(2)}`}</span>
          </div>

          {subtotal < 1000 && (
            <div className='text-sm text-blue-600 bg-blue-50 p-3 rounded-lg'>
              Add ₱{(1000 - subtotal).toFixed(2)} more for free shipping!
            </div>
          )}

          <div className='border-t pt-4'>
            <div className='flex justify-between text-lg font-bold text-gray-900'>
              <span>Total</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          className='w-full mt-6 bg-green-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-green-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
          disabled={cartItems.length === 0}
          onClick={checkoutHandler}
        >
          <LockClosedIcon className="w-5 h-5" />
          <span>Proceed to Checkout</span>
        </button>

        <p className='mt-4 text-center text-sm text-gray-500'>
          <Link to='/' className='font-medium text-green-600 hover:text-green-500 transition-colors'>
            ← Continue Shopping
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className='bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>


        {cartItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            <div className='lg:col-span-2'>
              <div className='mb-6'>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>Cart Items</h2>
                <p className='text-gray-600'>
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                </p>
              </div>

              <div className='space-y-4'>
                {cartItems.map((item) => (
                  <div
                    key={item.product}
                    className='bg-white rounded-2xl p-6 shadow-lg ring-1 ring-gray-200 transition-all hover:shadow-xl'
                  >
                    <div className='flex items-center space-x-4'>
                      <div className='h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl'>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='h-full w-full object-contain object-center'
                        />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <h3 className='text-lg font-medium text-gray-900 truncate'>
                          <Link
                            to={`/product/${item.product}`}
                            className='hover:text-green-600 transition-colors'
                          >
                            {item.name}
                          </Link>
                        </h3>
                        <p className='text-xl font-bold text-green-600 mt-1'>
                          ₱{item.price}
                        </p>
                      </div>

                      <div className='flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4'>
                        <div className='flex items-center space-x-3'>
                          <label htmlFor={`quantity-${item.product}`} className='text-sm text-gray-600 whitespace-nowrap'>
                            Qty:
                          </label>
                          <select
                            id={`quantity-${item.product}`}
                            className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[60px]'
                            value={item.qty}
                            onChange={(e) =>
                              dispatch(
                                addToCart({
                                  id: item.product,
                                  qty: Number(e.target.value),
                                })
                              )
                            }
                          >
                            {[...Array(Math.min(item.countInStock, 10)).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type='button'
                          className='p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 self-start sm:self-center'
                          onClick={() => removeCartItemHandler(item.product)}
                          title='Remove item'
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='lg:col-span-1'>
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
