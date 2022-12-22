import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

interface ICheckoutStepsProps {
  step1?: boolean
  step2?: boolean
  step3?: boolean
  step4?: boolean
}

const CheckoutSteps: React.FC<ICheckoutStepsProps> = ({
  step1,
  step2,
  step3,
  step4,
}) => {
  return (
    <div className='flex justify-center sm:space-x-5 mt-10 content-center'>
      {step1 ? (
        <Link to='/login'>
          <div className='text-green-600 font-bold text-sm sm:text-base'>
            Sign In
          </div>
        </Link>
      ) : (
        <div className='text-gray-400 text-sm sm:text-base'>Sign In</div>
      )}
      <ChevronRightIcon className='h-4 sm:h-5 self-center text-gray-400' />
      {step2 ? (
        <Link to='/shipping'>
          <div className='text-green-600 font-bold text-sm sm:text-base'>
            Shipping
          </div>
        </Link>
      ) : (
        <div className='text-gray-400 text-sm sm:text-base'>Shipping</div>
      )}
      <ChevronRightIcon className='h-4 sm:h-5 self-center text-gray-400' />
      {step3 ? (
        <Link to='/payment'>
          <div className='text-green-600 font-bold text-sm sm:text-base'>
            Payment
          </div>
        </Link>
      ) : (
        <div className='text-gray-400 text-sm sm:text-base'>Payment</div>
      )}
      <ChevronRightIcon className='h-4 sm:h-5 self-center text-gray-400' />
      {step4 ? (
        <Link to='/placeorder'>
          <div className='text-green-600 font-bold text-sm sm:text-base'>
            Place Order
          </div>
        </Link>
      ) : (
        <div className='text-gray-400 text-sm sm:text-base'>Place Order</div>
      )}
    </div>
  )
}

export default CheckoutSteps
