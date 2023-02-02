import React from 'react'

const Hero = () => {
  return (
    <div className='relative w-full py-4 sm:py-0'>
      <img
        src='images/hero/hero.jpg'
        alt='hero'
        className='m-auto w-fit rounded-2xl drop-shadow-lg'
      />
      <h1 className=' absolute top-1/4 left-4 w-32 font-lato font-extrabold sm:w-60 sm:px-10 md:top-32 md:left-20 md:w-3/4 lg:left-24 lg:top-1/3 xl:left-44 xl:top-1/3'>
        <p className='text-xl text-green-600 sm:mb-2 sm:text-4xl md:text-4xl lg:text-6xl'>
          Fresh <br /> Produced
        </p>
        <span className='text-sm text-slate-700 lg:text-xl'>
          delivered straight to your doorstep.
        </span>
      </h1>
    </div>
  )
}

export default Hero
