import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { savePaymentMethod } from '../features/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'
import { useFormState } from '../hooks/useFormState'
import {
  CreditCardIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const Payment = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { shippingAddress } = useAppSelector((state) => state.cart)

  if (!shippingAddress) {
    navigate('/shipping')
  }

  const {
    values,
    hasFieldError,
    getFieldError,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
  } = useFormState({
    paymentMethod: {
      initialValue: 'PayPal',
      required: true,
      validate: (value: string) => {
        if (!value) return "Please select a payment method";
        return null;
      },
    },
  });

  const submitHandler = async (values: Record<string, any>) => {
    dispatch(savePaymentMethod(values.paymentMethod))
    navigate('/placeorder')
  }
  return (
    <div className='bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <CheckoutSteps step1 step2 step3 />

        <div className='grid lg:grid-cols-12 lg:gap-12 mt-8'>
          {/* Main Content */}
          <div className='lg:col-span-8'>
            <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200'>
              {/* Header */}
              <div className='mb-8'>
                <div className='flex items-center space-x-3 mb-4'>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                    <CreditCardIcon className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
                      Payment Method
                    </h1>
                    <p className='text-gray-600 mt-1'>
                      Choose how you'd like to pay for your order
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <form onSubmit={handleSubmit(submitHandler)} className='space-y-6'>
                <div className='space-y-4'>
                  <h3 className='text-lg font-medium text-gray-900 mb-4'>
                    Available Payment Methods
                  </h3>

                  {/* PayPal Option */}
                  <div className='relative'>
                    <input
                      type='radio'
                      id='paypal'
                      name='paymentMethod'
                      value='PayPal'
                      checked={values.paymentMethod === 'PayPal'}
                      onChange={handleChange("paymentMethod")}
                      onBlur={handleBlur("paymentMethod")}
                      className='sr-only'
                    />
                    <label
                      htmlFor='paypal'
                      className={`relative flex cursor-pointer rounded-2xl border-2 p-6 transition-all ${values.paymentMethod === 'PayPal'
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex items-center space-x-4'>
                          <div className='flex-shrink-0'>
                            <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                              <CreditCardIcon className='w-6 h-6 text-blue-600' />
                            </div>
                          </div>
                          <div>
                            <div className='font-medium text-gray-900'>PayPal</div>
                            <div className='text-sm text-gray-600'>
                              Pay with PayPal or any major credit card
                            </div>
                            <div className='flex items-center space-x-2 mt-2'>
                              <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium'>
                                Secure
                              </span>
                              <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium'>
                                Instant
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='flex-shrink-0'>
                          {values.paymentMethod === 'PayPal' && (
                            <CheckCircleIcon className='w-6 h-6 text-blue-600' />
                          )}
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Credit Card Option (Future) */}
                  <div className='relative opacity-50'>
                    <div className='relative flex cursor-not-allowed rounded-2xl border-2 border-gray-200 p-6'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex items-center space-x-4'>
                          <div className='flex-shrink-0'>
                            <div className='w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center'>
                              <CreditCardIcon className='w-6 h-6 text-gray-400' />
                            </div>
                          </div>
                          <div>
                            <div className='font-medium text-gray-600'>Direct Credit Card</div>
                            <div className='text-sm text-gray-500'>
                              Coming soon - Pay directly with your card
                            </div>
                            <div className='flex items-center space-x-2 mt-2'>
                              <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium'>
                                Coming Soon
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <div className='pt-6'>
                  <button
                    type='submit'
                    disabled={isSubmitting || !isValid}
                    className='w-full flex justify-center items-center space-x-2 rounded-xl bg-green-600 py-4 px-6 font-medium text-white transition-all hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400'
                  >
                    <span>
                      {isSubmitting ? "Processing..." : "Continue to Review Order"}
                    </span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar - Security Info */}
          <div className='lg:col-span-4 mt-8 lg:mt-0'>
            <div className='rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-200 sticky top-8'>
              <h3 className='text-lg font-semibold text-gray-900 mb-6'>
                Secure Payment
              </h3>

              <div className='space-y-4'>
                <div className='flex items-start space-x-3'>
                  <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-0.5'>
                    <ShieldCheckIcon className='w-4 h-4 text-green-600' />
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>SSL Encrypted</h4>
                    <p className='text-sm text-gray-600'>Your payment data is protected</p>
                  </div>
                </div>

                <div className='flex items-start space-x-3'>
                  <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5'>
                    <LockClosedIcon className='w-4 h-4 text-blue-600' />
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>PCI Compliant</h4>
                    <p className='text-sm text-gray-600'>Industry standard security</p>
                  </div>
                </div>

                <div className='flex items-start space-x-3'>
                  <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-0.5'>
                    <CheckCircleIcon className='w-4 h-4 text-purple-600' />
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>Buyer Protection</h4>
                    <p className='text-sm text-gray-600'>Money back guarantee</p>
                  </div>
                </div>
              </div>

              <div className='mt-6 pt-6 border-t border-gray-200'>
                <div className='flex items-center space-x-2 text-sm text-gray-600'>
                  <LockClosedIcon className='w-4 h-4' />
                  <span>Powered by PayPal</span>
                </div>
                <p className='text-xs text-gray-500 mt-2'>
                  We never store your payment information on our servers
                </p>
              </div>

              {/* Trust Badges */}
              <div className='mt-6 pt-6 border-t border-gray-200'>
                <p className='text-xs font-medium text-gray-700 mb-3'>Trusted by:</p>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='bg-gray-50 rounded-lg p-3 text-center'>
                    <div className='text-xs font-medium text-gray-600'>256-bit</div>
                    <div className='text-xs text-gray-500'>SSL</div>
                  </div>
                  <div className='bg-gray-50 rounded-lg p-3 text-center'>
                    <div className='text-xs font-medium text-gray-600'>PCI</div>
                    <div className='text-xs text-gray-500'>Compliant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
