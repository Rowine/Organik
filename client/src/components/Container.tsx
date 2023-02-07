import React from 'react'

interface IContainerProps {
  children: React.ReactNode
}

const Container: React.FC<IContainerProps> = ({ children }) => {
  return (
    <div className='mx-auto h-fit w-full max-w-7xl sm:px-6 sm:py-10 lg:px-8'>
      {children}
    </div>
  )
}

export default Container
