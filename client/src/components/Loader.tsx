import React from 'react'

const Loader = () => {
  return (
    <div className='grid h-full place-items-center'>
      <svg
        className='sm:h-15 sm:w-15 -ml-1 mr-3 h-10 w-10 animate-spin text-black md:h-20 md:w-20'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        ></circle>
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        ></path>
      </svg>
      <span className='sr-only'>Loading...</span>
    </div>
  )
}

export default Loader
