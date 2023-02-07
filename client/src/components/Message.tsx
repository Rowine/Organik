import React from 'react'

interface IMessageProps {
  type: 'error' | 'info' | 'alert' | 'success'
  children: React.ReactNode
}

const Message = ({ type, children }: IMessageProps) => {
  const variant = {
    error: 'bg-rose-200 text-red-800',
    info: 'bg-indigo-200 text-blue-800',
    alert: 'bg-amber-200 text-yellow-800',
    success: 'bg-green-200 text-green-800',
  }

  const theme = variant[type]
  return (
    <div className={`w-full rounded-sm p-3 font-lato ${theme}`}>{children}</div>
  )
}

export default Message
