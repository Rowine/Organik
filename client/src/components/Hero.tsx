import React from 'react'

const Hero = () => {
  return (
    <div className='w-full py-4 sm:py-10 relative'>
      <h1 className='absolute top-12 sm:top-1/2 sm:px-10 font-bold text-slate-700 w-40 sm:w-full ml-4 sm:m-0'>
        <p className='text-2xl sm:text-4xl lg:text-6xl sm:mb-2'>
          Freshly Produced
        </p>
        <span className='text-sm sm:text-xl lg:text-2xl'>
          delivered straight to your doorstep.
        </span>
      </h1>
      <img
        src='../../public/images/hero/hero.jpg'
        alt='hero'
        className=' w-full bg-gray-200'
      />
    </div>
  )
}

export default Hero
