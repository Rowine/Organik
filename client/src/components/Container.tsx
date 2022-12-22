import React from 'react'

interface IContainerProps {
  children: React.ReactNode
}

const Container: React.FC<IContainerProps> = ({ children }) => {
  return (
    <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 sm:py-10 h-fit w-full'>
      {children}
    </div>
  )
}

export default Container
