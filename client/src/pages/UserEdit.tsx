import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails } from '../features/userDetailsSlice'
import { updateUser } from '../features/userUpdateSlice'
import { resetUpdateProfile } from '../features/userUpdateSlice'
import Container from '../components/Container'
import { IUser } from '../interfaces/IUserLoginState'
import { getUserFriendlyMessage } from '../utils/errorUtils'

const UserEdit = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const navigate = useNavigate()
  const { id } = useParams()

  const dispatch = useAppDispatch()
  const userDetails = useAppSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userUpdate = useAppSelector((state) => state.userUpdate)
  const { loading: loadingUpdate, error: errorUpdate } = userUpdate

  useEffect(() => {
    if (loadingUpdate === 'succeeded') {
      dispatch(resetUpdateProfile())
      navigate('/admin/userlist')
    } else {
      if (!user.name || user._id !== id) {
        dispatch(getUserDetails(id as string))
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
      }
    }
  }, [dispatch, user, id, loadingUpdate, navigate])

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(updateUser({ _id: id, name, email, isAdmin } as IUser))
  }
  return (
    <Container>
      <div className='mt-4'>
        <Link
          to='/admin/userlist'
          className='text-green-500 hover:text-green-700 text-xl font-medium'
        >
          Go Back
        </Link>
      </div>
      <div className='flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 h-50'>
        <div className='w-full max-w-md space-y-6'>
          <div>
            <h2 className='my-16 text-center text-4xl font-bold tracking-tight text-gray-900'>
              Edit User
            </h2>
          </div>
          {loadingUpdate === 'pending' && <Loader />}
          {errorUpdate && (
            <Message type='error'>
              {typeof errorUpdate === 'string' ? errorUpdate : getUserFriendlyMessage(errorUpdate)}
              . Please try again later.
            </Message>
          )}
          {loading === 'pending' ? (
            <Loader />
          ) : error ? (
            <Message type='error'>
              {error.code === "UNAUTHORIZED" ? "You need to login" :
                error.code === "ACCESS_FORBIDDEN" ? "You do not have permission" :
                  getUserFriendlyMessage(error) + ". Please try again later."}
            </Message>
          ) : (
            <form className='space-y-6' onSubmit={submitHandler}>
              <input type='hidden' name='remember' defaultValue='true' />
              <div className='space-y-4 shadow-sm'>
                <div>
                  <label htmlFor='name' className='sr-only'>
                    Name
                  </label>
                  <input
                    id='name'
                    name='name'
                    type='text'
                    autoComplete='name'
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
                    value={email}
                    className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                    placeholder='Email address'
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    id='is-admin'
                    name='is-admin'
                    type='checkbox'
                    className=' text-green-600 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm form-checkbox rounded'
                    placeholder='Repeat Password'
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                  />
                  <label htmlFor='is-admin' className='ml-2 text-sm'>
                    Is Admin
                  </label>
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
          )}
        </div>
      </div>
    </Container>
  )
}

export default UserEdit
