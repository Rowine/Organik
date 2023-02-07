import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Container from '../components/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTimes,
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
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
    <Container>
      <div className='grid lg:grid-cols-12 lg:gap-x-12'>
        <div className='hidden sm:block lg:col-span-3 lg:h-screen'>
          <div>
            <h2 className='my-6 text-center font-lato text-2xl font-bold tracking-tight text-gray-900'>
              User Profile
            </h2>
          </div>
          {message && <Message type='error'>{message}</Message>}
          {error && <Message type='error'>{error}</Message>}
          {loading === 'pending' && <Loader />}
          {updateLoading === 'succeeded' && (
            <Message type='success'>Profile Updated</Message>
          )}
          <form className='space-y-6' onSubmit={submitHandler}>
            <input type='hidden' name='remember' defaultValue='true' />
            <div className='space-y-4 rounded-md shadow-sm'>
              <div>
                <label htmlFor='name' className='sr-only'>
                  Name
                </label>
                <input
                  id='name'
                  name='name'
                  type='text'
                  autoComplete='name'
                  required
                  value={name}
                  className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  placeholder='Enter Name'
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor='email-address' className='sr-only'>
                  Email address
                </label>
                <input
                  id='email-address'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={email}
                  className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  placeholder='Email address'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor='password' className='sr-only'>
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor='confirm-password' className='sr-only'>
                  Confirm Password
                </label>
                <input
                  id='confirm-password'
                  name='confirm-password'
                  type='password'
                  required={password ? true : false}
                  className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  placeholder='Repeat Password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type='submit'
                className='group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              >
                Update
              </button>
            </div>
          </form>
        </div>

        <div className='sm:my-5 lg:col-span-9'>
          <h2 className='my-6 font-lato text-3xl font-bold tracking-tight text-gray-900'>
            My Orders
          </h2>
          {loadingOrders === 'pending' ? (
            <Loader />
          ) : errorOrders ? (
            <Message type='error'>{errorOrders}</Message>
          ) : (
            <table className='w-full table-fixed border-collapse shadow-md'>
              <thead>
                <tr className='bg-green-600 font-lato font-extrabold text-white'>
                  <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                    ID
                  </th>
                  <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                    DATE
                  </th>
                  <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                    TOTAL
                  </th>
                  <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                    PAID
                  </th>
                  <th className='text-center font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                    DELIVERED
                  </th>
                  <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'></th>
                </tr>
              </thead>
              <tbody className='bg-white last-of-type:border-b-2 last-of-type:border-green-600'>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className='border-b border-slate-200 even:bg-gray-100'
                  >
                    <td className='truncate text-slate-900 sm:p-4 sm:pl-8'>
                      {order._id}
                    </td>
                    <td className='break-words text-slate-900 sm:p-4 sm:pl-8'>
                      {format(order.createdAt.substring(0, 10))}
                    </td>
                    <td className=' text-slate-900 sm:p-4 sm:pl-8'>
                      ₱{order.totalPrice}
                    </td>
                    <td className=' break-words text-slate-900 sm:p-4 sm:pl-8'>
                      {order.isPaid ? (
                        format(order.paidAt.substring(0, 10))
                      ) : (
                        <FontAwesomeIcon icon={faTimes} color='red' />
                      )}
                    </td>
                    <td className='break-words text-center text-slate-900 sm:p-4 sm:pl-8'>
                      {order.isDelivered ? (
                        format(order.deliveredAt.substring(0, 10))
                      ) : (
                        <FontAwesomeIcon icon={faTimes} color='red' />
                      )}
                    </td>
                    <td className='border-b border-slate-200 text-slate-900 dark:text-slate-900 sm:p-4 sm:pl-8'>
                      <Link to={`/order/${order._id}`}>
                        <button className='group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'>
                          Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className='my-6  sm:hidden'>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className='flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'>
                  Update Profile{' '}
                  <FontAwesomeIcon
                    icon={open ? faChevronDown : faChevronRight}
                  />
                </Disclosure.Button>
                <Disclosure.Panel>
                  {message && <Message type='error'>{message}</Message>}
                  {error && <Message type='error'>{error}</Message>}
                  {loading === 'pending' && <Loader />}
                  {updateLoading === 'succeeded' && (
                    <Message type='success'>Profile Updated</Message>
                  )}
                  <form className='space-y-6' onSubmit={submitHandler}>
                    <input type='hidden' name='remember' defaultValue='true' />
                    <div className='space-y-4 rounded-md shadow-sm'>
                      <div>
                        <label htmlFor='name' className='sr-only'>
                          Name
                        </label>
                        <input
                          id='name'
                          name='name'
                          type='text'
                          autoComplete='name'
                          required
                          value={name}
                          className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                          placeholder='Enter Name'
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor='email-address' className='sr-only'>
                          Email address
                        </label>
                        <input
                          id='email-address'
                          name='email'
                          type='email'
                          autoComplete='email'
                          required
                          value={email}
                          className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                          placeholder='Email address'
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor='password' className='sr-only'>
                          Password
                        </label>
                        <input
                          id='password'
                          name='password'
                          type='password'
                          className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                          placeholder='Password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor='confirm-password' className='sr-only'>
                          Confirm Password
                        </label>
                        <input
                          id='confirm-password'
                          name='confirm-password'
                          type='password'
                          required={password ? true : false}
                          className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                          placeholder='Repeat Password'
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        type='submit'
                        className='group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </Container>
  )
}

export default Profile
