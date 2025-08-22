import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { Disclosure } from '@headlessui/react'
import { getUserDetails } from '../features/userDetailsSlice'
import { updateUserProfile } from '../features/userUpdateProfileSlice'
import { listMyOrders } from '../features/orderListMySlice'
import { IUser } from '../interfaces/IUserLoginState'

export function format(inputDate: string) {
  var dob = new Date(inputDate)
  var dobArr = dob.toDateString().split(' ')
  var dobFormat = dobArr[1] + ' ' + dobArr[2] + ' ' + dobArr[3]
  return dobFormat
}

const Profile = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const userDetails = useAppSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userLogin = useAppSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderListMy = useAppSelector((state) => state.orderListMy)
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

  const userUpdateProfile = useAppSelector((state) => state.userUpdateProfile)
  const { loading: updateLoading } = userUpdateProfile

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrders())
      } else {
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [userInfo, user])

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(
        updateUserProfile({ _id: user._id, name, email, password } as IUser)
      )
    }
  }
  return (
    <main className='flex-grow bg-gradient-to-br from-gray-50 via-white to-gray-50'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid lg:grid-cols-12 lg:gap-x-12'>
          {/* Profile Update Section - Desktop */}
          <div className='hidden sm:block lg:col-span-4'>
            <div className='sticky top-8'>
              <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200'>
                <div className='text-center mb-8'>
                  <div className='mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center mb-4'>
                    <UserIcon className='w-10 h-10 text-white' />
                  </div>
                  <h2 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>
                    Profile Settings
                  </h2>
                  <p className='mt-2 text-sm text-gray-600'>
                    Update your account information
                  </p>
                </div>

                {message && <Message type='error'>{message}</Message>}
                {error && <Message type='error'>{error}</Message>}
                {loading === 'pending' && <Loader />}
                {updateLoading === 'succeeded' && (
                  <Message type='success'>Profile Updated</Message>
                )}

                <form className='space-y-6' onSubmit={submitHandler}>
                  <div className='space-y-5'>
                    <div>
                      <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                        Full Name
                      </label>
                      <input
                        id='name'
                        name='name'
                        type='text'
                        autoComplete='name'
                        required
                        value={name}
                        className='mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200'
                        placeholder='Enter your full name'
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor='email-address' className='block text-sm font-medium text-gray-700'>
                        Email Address
                      </label>
                      <input
                        id='email-address'
                        name='email'
                        type='email'
                        autoComplete='email'
                        required
                        value={email}
                        className='mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200'
                        placeholder='Enter your email'
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                        New Password
                      </label>
                      <input
                        id='password'
                        name='password'
                        type='password'
                        className='mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200'
                        placeholder='Leave blank to keep current password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor='confirm-password' className='block text-sm font-medium text-gray-700'>
                        Confirm Password
                      </label>
                      <input
                        id='confirm-password'
                        name='confirm-password'
                        type='password'
                        required={password ? true : false}
                        className='mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200'
                        placeholder='Confirm your new password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type='submit'
                    className='w-full flex justify-center items-center space-x-2 rounded-xl bg-green-600 py-3 px-6 font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                  >
                    <span>Update Profile</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className='lg:col-span-8'>
            <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200'>
              <div className='mb-8'>
                <h2 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>
                  Order History
                </h2>
                <p className='mt-2 text-sm text-gray-600'>
                  Track your orders and view purchase history
                </p>
              </div>

              {loadingOrders === 'pending' ? (
                <div className='flex min-h-[400px] items-center justify-center'>
                  <Loader />
                </div>
              ) : errorOrders ? (
                <Message type='error'>{errorOrders}</Message>
              ) : orders.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                    <ClockIcon className='w-8 h-8 text-gray-400' />
                  </div>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>No orders yet</h3>
                  <p className='text-gray-500 mb-6'>Start shopping to see your orders here</p>
                  <Link to='/'>
                    <button className='inline-flex items-center rounded-xl bg-green-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg'>
                      Start Shopping
                    </button>
                  </Link>
                </div>
              ) : (
                <div className='space-y-4'>
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className='border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow'
                    >
                      <div className='space-y-4'>
                        {/* Top Row - Order Info */}
                        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
                          <div>
                            <p className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                              Order ID
                            </p>
                            <p className='text-sm font-medium text-gray-900 truncate'>
                              {order._id.slice(-8)}
                            </p>
                          </div>
                          <div>
                            <p className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                              Date
                            </p>
                            <p className='text-sm font-medium text-gray-900'>
                              {format(order.createdAt.substring(0, 10))}
                            </p>
                          </div>
                          <div className='col-span-2 sm:col-span-1'>
                            <p className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                              Total
                            </p>
                            <p className='text-sm font-bold text-green-600'>
                              ₱{order.totalPrice}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Row - Status and Action */}
                        <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
                          <div>
                            <p className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>
                              Status
                            </p>
                            <div className='flex flex-wrap items-center gap-3'>
                              <div className='flex items-center space-x-1'>
                                {order.isPaid ? (
                                  <CheckCircleIcon className='w-4 h-4 text-green-500' />
                                ) : (
                                  <XMarkIcon className='w-4 h-4 text-red-500' />
                                )}
                                <span className={`text-xs font-medium ${order.isPaid ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                  {order.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                              </div>
                              <div className='flex items-center space-x-1'>
                                {order.isDelivered ? (
                                  <CheckCircleIcon className='w-4 h-4 text-green-500' />
                                ) : (
                                  <ClockIcon className='w-4 h-4 text-yellow-500' />
                                )}
                                <span className={`text-xs font-medium ${order.isDelivered ? 'text-green-600' : 'text-yellow-600'
                                  }`}>
                                  {order.isDelivered ? 'Delivered' : 'Processing'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className='flex-shrink-0'>
                            <Link to={`/order/${order._id}`}>
                              <button className='w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'>
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Mobile Profile Update */}
          <div className='lg:hidden mb-8'>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className='flex w-full items-center justify-center space-x-2 rounded-xl bg-green-600 py-3 px-6 font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'>
                    <UserIcon className='w-5 h-5' />
                    <span>Update Profile</span>
                    {open ? (
                      <ChevronDownIcon className='w-5 h-5' />
                    ) : (
                      <ChevronRightIcon className='w-5 h-5' />
                    )}
                  </Disclosure.Button>
                  <Disclosure.Panel className='mt-4'>
                    <div className='rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-200'>
                      <div className='text-center mb-6'>
                        <div className='mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center mb-3'>
                          <UserIcon className='w-8 h-8 text-white' />
                        </div>
                        <h3 className='text-lg font-bold text-gray-900'>
                          Profile Settings
                        </h3>
                        <p className='mt-1 text-sm text-gray-600'>
                          Update your account information
                        </p>
                      </div>

                      {message && <Message type='error'>{message}</Message>}
                      {error && <Message type='error'>{error}</Message>}
                      {loading === 'pending' && <Loader />}
                      {updateLoading === 'succeeded' && (
                        <Message type='success'>Profile Updated</Message>
                      )}

                      <form className='space-y-5' onSubmit={submitHandler}>
                        <div>
                          <label htmlFor='mobile-name' className='block text-sm font-medium text-gray-700'>
                            Full Name
                          </label>
                          <input
                            id='mobile-name'
                            name='name'
                            type='text'
                            autoComplete='name'
                            required
                            value={name}
                            className='mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200'
                            placeholder='Enter your full name'
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor='mobile-email' className='block text-sm font-medium text-gray-700'>
                            Email Address
                          </label>
                          <input
                            id='mobile-email'
                            name='email'
                            type='email'
                            autoComplete='email'
                            required
                            value={email}
                            className='mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200'
                            placeholder='Enter your email'
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor='mobile-password' className='block text-sm font-medium text-gray-700'>
                            New Password
                          </label>
                          <input
                            id='mobile-password'
                            name='password'
                            type='password'
                            className='mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200'
                            placeholder='Leave blank to keep current password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor='mobile-confirm-password' className='block text-sm font-medium text-gray-700'>
                            Confirm Password
                          </label>
                          <input
                            id='mobile-confirm-password'
                            name='confirm-password'
                            type='password'
                            required={password ? true : false}
                            className='mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200'
                            placeholder='Confirm your new password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        <button
                          type='submit'
                          className='w-full flex justify-center items-center space-x-2 rounded-xl bg-green-600 py-3 px-6 font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                        >
                          <span>Update Profile</span>
                        </button>
                      </form>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Profile
