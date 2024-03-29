import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../features/userLoginSlice'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const userLogin = useAppSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo])

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(login({ email, password }))
  }
  return (
    <>
      <div className='flex max-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-6 rounded-xl bg-gray-200 p-10'>
          <div>
            <h2 className='text-center text-4xl font-bold tracking-tight text-gray-900'>
              Sign in to your account
            </h2>
          </div>
          {error && <Message type='error'>{error}</Message>}
          {loading === 'pending' ? (
            <Loader />
          ) : (
            <form className='space-y-6' onSubmit={submitHandler}>
              <input type='hidden' name='remember' defaultValue='true' />
              <div className='-space-y-px rounded-md shadow-sm'>
                <div className='mb-5'>
                  <label htmlFor='email-address' className='sr-only'>
                    Email address
                  </label>
                  <input
                    id='email-address'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
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
                    autoComplete='current-password'
                    required
                    className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                  />
                  <label
                    htmlFor='remember-me'
                    className='ml-2 block text-sm text-gray-900'
                  >
                    Remember me
                  </label>
                </div>

                <div className='text-sm'>
                  New Customer?{' '}
                  <Link
                    to={
                      redirect ? `/register?redirect=${redirect}` : '/register'
                    }
                    className='font-medium text-green-600 hover:text-green-500'
                  >
                    Register
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  className='group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                >
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default Login
