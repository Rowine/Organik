import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Container from '../components/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { getUserDetails } from '../features/userDetailsSlice'
import { updateUserProfile } from '../features/userUpdateProfileSlice'
import { listMyOrders } from '../features/orderListMySlice'
import { IUser } from '../interfaces/IUserLoginState'

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
        <div className='lg:col-span-3 lg:h-screen'>
          <div>
            <h2 className='my-6 text-center text-2xl font-bold tracking-tight text-gray-900'>
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
        <div className='lg:col-span-9 my-5'>
          <h2 className='my-6 text-3xl font-bold tracking-tight text-gray-900'>
            My Orders
          </h2>
          {loadingOrders === 'pending' ? (
            <Loader />
          ) : errorOrders ? (
            <Message type='error'>{errorOrders}</Message>
          ) : (
            <table className='table-fixed w-full'>
              <thead>
                <tr>
                  <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left'>
                    ID
                  </th>
                  <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left'>
                    DATE
                  </th>
                  <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left'>
                    TOTAL
                  </th>
                  <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left'>
                    PAID
                  </th>
                  <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-center'>
                    DELIVERED
                  </th>
                  <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left'></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900 break-words'>
                      {order._id}
                    </td>
                    <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900'>
                      {order.createdAt.substring(0, 10)}
                    </td>
                    <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900'>
                      {order.totalPrice}
                    </td>
                    <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900'>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FontAwesomeIcon icon={faTimes} color='red' />
                      )}
                    </td>
                    <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900 text-center'>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FontAwesomeIcon icon={faTimes} color='red' />
                      )}
                    </td>
                    <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900 dark:text-slate-900'>
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
      </div>
    </Container>
  )
}

export default Profile
