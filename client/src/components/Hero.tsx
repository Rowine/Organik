import React from 'react'
import Banner from '../assets/images/hero/hero.jpg'

const Hero = () => {
  return (
    <div className='w-full py-10 relative'>
      <h1 className='absolute top-36 sm:top-1/2 sm:px-10 font-bold text-slate-700'>
        <p className='text-3xl sm:text-4xl lg:text-6xl mb-2'>
          Freshly Produced
        </p>
        <span className='sm:text-xl lg:text-2xl'>
          delivered straight to your doorstep.
        </span>
      </h1>
      <img src={Banner} alt='hero' className='mx-auto w-full' />
    </div>
  )
}

export default Hero
