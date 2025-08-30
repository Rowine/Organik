import React from 'react'

interface IMessageAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

interface IMessageProps {
  type: 'error' | 'info' | 'alert' | 'success'
  children: React.ReactNode
  onClose?: () => void
  actions?: IMessageAction[]
  errorCode?: string
  retryAction?: () => void
  timestamp?: string
}

const Message = ({
  type,
  children,
  onClose,
  actions = [],
  errorCode,
  retryAction,
  timestamp
}: IMessageProps) => {
  const variants = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '⚠️',
      iconBg: 'bg-red-100'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'ℹ️',
      iconBg: 'bg-blue-100'
    },
    alert: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: '⚠️',
      iconBg: 'bg-yellow-100'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: '✅',
      iconBg: 'bg-green-100'
    },
  }

  const variant = variants[type]

  return (
    <div className={`w-full rounded-xl border p-4 ${variant.bg} ${variant.border} shadow-sm`}>
      <div className='flex flex-col space-y-3'>
        <div className='flex items-center space-x-3'>
          <div className={`flex-shrink-0 w-8 h-8 rounded-full ${variant.iconBg} flex items-center justify-center text-sm`}>
            {variant.icon}
          </div>
          <div className='flex-1'>
            <p className={`text-sm font-medium ${variant.text} leading-relaxed`}>
              {children}
            </p>
            {(errorCode || timestamp) && (
              <div className="mt-1 text-xs opacity-70">
                {errorCode && <span className="mr-2">Code: {errorCode}</span>}
                {timestamp && <span>{new Date(timestamp).toLocaleString()}</span>}
              </div>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={`flex-shrink-0 ${variant.text} hover:opacity-70 transition-opacity`}
              aria-label="Close message"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {(actions.length > 0 || retryAction) && (
          <div className="flex items-center space-x-2 mt-2">
            {retryAction && (
              <button
                onClick={retryAction}
                className={`px-3 py-1 text-sm font-medium rounded-md ${variant.text} ${variant.bg} border ${variant.border} hover:opacity-80 transition-opacity`}
              >
                Retry
              </button>
            )}
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`px-3 py-1 text-sm font-medium rounded-md 
                  ${action.variant === 'primary'
                    ? `bg-${type}-600 text-white hover:bg-${type}-700`
                    : `${variant.text} ${variant.bg} border ${variant.border} hover:opacity-80`
                  } transition-opacity`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Message
