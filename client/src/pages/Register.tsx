import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { register } from '../features/userRegisterSlice'
import { getUserFriendlyMessage, getErrorActions, isRetryableError } from '../utils/errorUtils'
import { ValidationError } from '../types/errors'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: ValidationError }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const userRegister = useAppSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo])

  const validateField = (field: string, value: string) => {
    const errors: { [key: string]: ValidationError } = {}

    switch (field) {
      case 'name':
        if (value.trim().length < 2) {
          errors.name = {
            message: 'Name must be at least 2 characters',
            code: "VALIDATION_ERROR",
            field: 'name',
            status: 400
          }
        }
        break
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          errors.email = {
            message: 'Please enter a valid email address',
            code: "VALIDATION_ERROR",
            field: 'email',
            status: 400
          }
        }
        break
      case 'password':
        if (value.length < 6) {
          errors.password = {
            message: 'Password must be at least 6 characters',
            code: "VALIDATION_ERROR",
            field: 'password',
            status: 400
          }
        }
        if (confirmPassword && touched.confirmPassword && value !== confirmPassword) {
          errors.confirmPassword = {
            message: 'Passwords do not match',
            code: "VALIDATION_ERROR",
            field: 'confirmPassword',
            status: 400
          }
        }
        break
      case 'confirmPassword':
        if (value !== password) {
          errors.confirmPassword = {
            message: 'Passwords do not match',
            code: "VALIDATION_ERROR",
            field: 'confirmPassword',
            status: 400
          }
        }
        break
    }

    setFieldErrors(prev => {
      const newErrors = { ...prev }
      if (Object.keys(errors).length > 0) {
        Object.assign(newErrors, errors)
      } else {
        delete newErrors[field]
        // Clear confirmPassword error when password is fixed
        if (field === 'password' && newErrors.confirmPassword?.code === 'VALIDATION_ERROR' && newErrors.confirmPassword?.field === 'confirmPassword') {
          delete newErrors.confirmPassword
        }
      }
      return newErrors
    })
  }

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case 'name':
        setName(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      case 'confirmPassword':
        setConfirmPassword(value)
        break
    }

    if (touched[field]) {
      validateField(field, value)
    }
  }

  const handleFieldBlur = (field: string, value: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateField(field, value)
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '', width: '0%' }
    if (password.length < 6) return { strength: 1, text: 'Weak', color: 'bg-red-500', width: '25%' }
    if (password.length < 8) return { strength: 2, text: 'Fair', color: 'bg-yellow-500', width: '50%' }
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
      return { strength: 4, text: 'Strong', color: 'bg-green-500', width: '100%' }
    }
    return { strength: 3, text: 'Good', color: 'bg-blue-500', width: '75%' }
  }

  const passwordStrength = getPasswordStrength(password)

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')

    // Mark all fields as touched for validation
    const allFields = { name: true, email: true, password: true, confirmPassword: true }
    setTouched(allFields)

    // Validate all fields
    validateField('name', name)
    validateField('email', email)
    validateField('password', password)
    validateField('confirmPassword', confirmPassword)

    // Check for errors after a brief delay to ensure validation is complete
    setTimeout(() => {
      const hasErrors = Object.keys(fieldErrors).length > 0
      if (hasErrors) {
        setMessage('Please fix the errors above')
        return
      }

      if (!name.trim() || !email || !password || !confirmPassword) {
        setMessage('Please fill in all fields')
        return
      }

      dispatch(register({ name: name.trim(), email, password }))
    }, 100)
  }

  return (
    <>
      <main className='flex-grow bg-gradient-to-br from-gray-50 via-white to-gray-50'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex min-h-[calc(100vh-16rem)] items-center justify-center py-12'>
            <div className='w-full max-w-md space-y-8'>
              <div className='text-center'>
                <h2 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                  Create Account
                </h2>
                <p className='mt-4 text-base text-gray-600 sm:text-lg'>
                  Join us and start shopping fresh
                </p>
              </div>

              {message && (
                <Message
                  type='error'
                  onClose={() => setMessage('')}
                >
                  {message}
                </Message>
              )}
              {error && (
                <Message
                  type='error'
                >
                  {error.message + ". Please try again later."}
                </Message>
              )}

              {loading === 'pending' ? (
                <div className='flex min-h-[300px] items-center justify-center'>
                  <Loader />
                </div>
              ) : (
                <div className='mt-8'>
                  <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200'>
                    <form className='space-y-6' onSubmit={submitHandler}>
                      <div className='space-y-5'>
                        {/* Personal Information Section */}
                        <div className='border-b border-gray-100 pb-4'>
                          <h3 className='text-sm font-medium text-gray-700 mb-4'>Personal Information</h3>

                          <div>
                            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                              Full Name *
                            </label>
                            <input
                              id='name'
                              name='name'
                              type='text'
                              required
                              value={name}
                              className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${fieldErrors.name
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                                }`}
                              placeholder='Enter your full name'
                              onChange={(e) => handleFieldChange('name', e.target.value)}
                              onBlur={(e) => handleFieldBlur('name', e.target.value)}
                            />
                            {fieldErrors.name && (
                              <p className="mt-2 text-sm text-red-600">
                                {fieldErrors.name.message}
                              </p>
                            )}
                          </div>

                          <div className='mt-4'>
                            <label htmlFor='email-address' className='block text-sm font-medium text-gray-700'>
                              Email Address *
                            </label>
                            <input
                              id='email-address'
                              name='email'
                              type='email'
                              autoComplete='email'
                              required
                              value={email}
                              className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${fieldErrors.email
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                                }`}
                              placeholder='Enter your email address'
                              onChange={(e) => handleFieldChange('email', e.target.value)}
                              onBlur={(e) => handleFieldBlur('email', e.target.value)}
                            />
                            {fieldErrors.email && (
                              <p className="mt-2 text-sm text-red-600">
                                {fieldErrors.email.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Security Section */}
                        <div>
                          <h3 className='text-sm font-medium text-gray-700 mb-4'>Security</h3>

                          <div>
                            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                              Password *
                            </label>
                            <input
                              id='password'
                              name='password'
                              type='password'
                              required
                              value={password}
                              className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${fieldErrors.password
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                                }`}
                              placeholder='Create a strong password'
                              onChange={(e) => handleFieldChange('password', e.target.value)}
                              onBlur={(e) => handleFieldBlur('password', e.target.value)}
                            />
                            {fieldErrors.password && (
                              <p className="mt-2 text-sm text-red-600">
                                {fieldErrors.password.message}
                              </p>
                            )}

                            {/* Password Strength Indicator */}
                            {password && (
                              <div className='mt-2'>
                                <div className='flex justify-between text-xs text-gray-600 mb-1'>
                                  <span>Password strength</span>
                                  <span className={`font-medium ${passwordStrength.strength === 1 ? 'text-red-500' :
                                    passwordStrength.strength === 2 ? 'text-yellow-500' :
                                      passwordStrength.strength === 3 ? 'text-blue-500' :
                                        'text-green-500'
                                    }`}>
                                    {passwordStrength.text}
                                  </span>
                                </div>
                                <div className='w-full bg-gray-200 rounded-full h-2'>
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                    style={{ width: passwordStrength.width }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className='mt-4'>
                            <label htmlFor='confirm-password' className='block text-sm font-medium text-gray-700'>
                              Confirm Password *
                            </label>
                            <input
                              id='confirm-password'
                              name='confirm-password'
                              type='password'
                              required
                              value={confirmPassword}
                              className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${fieldErrors.confirmPassword
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                                }`}
                              placeholder='Confirm your password'
                              onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                              onBlur={(e) => handleFieldBlur('confirmPassword', e.target.value)}
                            />
                            {fieldErrors.confirmPassword && (
                              <p className="mt-2 text-sm text-red-600">
                                {fieldErrors.confirmPassword.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className='pt-4'>
                        <button
                          type='submit'
                          disabled={Object.keys(fieldErrors).length > 0 || !name || !email || !password || !confirmPassword}
                          className='flex w-full justify-center rounded-xl bg-green-600 px-8 py-3 text-base font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed sm:text-lg'
                        >
                          Create Account
                        </button>
                      </div>
                    </form>
                  </div>

                  <p className='mt-6 text-center text-sm text-gray-600'>
                    Already have an account?{' '}
                    <Link
                      to={redirect ? `/login?redirect=${redirect}` : '/login'}
                      className='font-medium text-green-600 transition-colors hover:text-green-500'
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Register