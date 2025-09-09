import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { saveShippingAddress } from '../features/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'
import { useFormState, validators } from '../hooks/useFormState'
import {
  TruckIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline'

const Shipping = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { shippingAddress } = useAppSelector((state) => state.cart)

  const {
    values,
    hasFieldError,
    getFieldError,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
    setValue,
  } = useFormState({
    address: {
      initialValue: shippingAddress.address || "",
      required: true,
      validate: validators.minLength(5, "Address must be at least 5 characters"),
    },
    city: {
      initialValue: shippingAddress.city || "",
      required: true,
      validate: validators.minLength(2, "City must be at least 2 characters"),
    },
    postalCode: {
      initialValue: shippingAddress.postalCode || "",
      required: true,
      validate: (value: string) => {
        if (!value) return "Postal code is required";
        if (!/^\d{4}$/.test(value)) return "Postal code must be 4 digits";
        return null;
      },
    },
  });

  const submitHandler = async (values: Record<string, any>) => {
    dispatch(
      saveShippingAddress({
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
      })
    )
    navigate('/payment')
  }
  return (
    <div className='bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <CheckoutSteps step1 step2 />

        <div className='grid lg:grid-cols-12 lg:gap-12 mt-8'>
          {/* Main Content */}
          <div className='lg:col-span-8'>
            <div className='rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200'>
              {/* Header */}
              <div className='mb-8'>
                <div className='flex items-center space-x-3 mb-4'>
                  <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                    <TruckIcon className='w-6 h-6 text-green-600' />
                  </div>
                  <div>
                    <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
                      Shipping Information
                    </h1>
                    <p className='text-gray-600 mt-1'>
                      Where should we deliver your fresh products?
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(submitHandler)} className='space-y-6'>
                {/* Address Field */}
                <div>
                  <label htmlFor='address' className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                    <MapPinIcon className='w-5 h-5 mr-2 text-gray-400' />
                    Street Address
                  </label>
                  <input
                    type='text'
                    name='address'
                    id='address'
                    required
                    placeholder='123 Main Street, Apartment 4B'
                    value={values.address}
                    onChange={handleChange("address")}
                    onBlur={handleBlur("address")}
                    className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${hasFieldError("address")
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                      }`}
                  />
                  {hasFieldError("address") ? (
                    <p className='mt-1 text-sm text-red-600'>
                      {getFieldError("address")?.message}
                    </p>
                  ) : (
                    <p className='mt-1 text-xs text-gray-500'>
                      Include apartment, suite, or unit number if applicable
                    </p>
                  )}
                </div>

                {/* City and Postal Code Row */}
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  <div>
                    <label htmlFor='city' className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                      <BuildingOfficeIcon className='w-5 h-5 mr-2 text-gray-400' />
                      City
                    </label>
                    <input
                      type='text'
                      name='city'
                      id='city'
                      required
                      placeholder='Manila'
                      value={values.city}
                      onChange={handleChange("city")}
                      onBlur={handleBlur("city")}
                      className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${hasFieldError("city")
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                        }`}
                    />
                    {hasFieldError("city") && (
                      <p className='mt-1 text-sm text-red-600'>
                        {getFieldError("city")?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor='postalCode' className='flex items-center text-sm font-medium text-gray-700 mb-2'>
                      <IdentificationIcon className='w-5 h-5 mr-2 text-gray-400' />
                      Postal Code
                    </label>
                    <input
                      type='text'
                      name='postalCode'
                      id='postalCode'
                      placeholder='1000'
                      required
                      value={values.postalCode}
                      onChange={handleChange("postalCode")}
                      onBlur={handleBlur("postalCode")}
                      className={`mt-1 block w-full rounded-xl border px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 ${hasFieldError("postalCode")
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                        }`}
                    />
                    {hasFieldError("postalCode") && (
                      <p className='mt-1 text-sm text-red-600'>
                        {getFieldError("postalCode")?.message}
                      </p>
                    )}
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
                      {isSubmitting ? "Processing..." : "Continue to Payment"}
                    </span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar - Delivery Info */}
          <div className='lg:col-span-4 mt-8 lg:mt-0'>
            <div className='rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-200 sticky top-8'>
              <h3 className='text-lg font-semibold text-gray-900 mb-6'>
                Delivery Information
              </h3>

              <div className='space-y-4'>
                <div className='flex items-start space-x-3'>
                  <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-0.5'>
                    <TruckIcon className='w-4 h-4 text-green-600' />
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>Free Delivery</h4>
                    <p className='text-sm text-gray-600'>On orders over ₱1,000</p>
                  </div>
                </div>

                <div className='flex items-start space-x-3'>
                  <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5'>
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>Same Day Delivery</h4>
                    <p className='text-sm text-gray-600'>Order before 2 PM</p>
                  </div>
                </div>

                <div className='flex items-start space-x-3'>
                  <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-0.5'>
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-900'>Quality Guarantee</h4>
                    <p className='text-sm text-gray-600'>Fresh or your money back</p>
                  </div>
                </div>
              </div>

              <div className='mt-6 pt-6 border-t border-gray-200'>
                <p className='text-xs text-gray-500'>
                  🔒 Your information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shipping
