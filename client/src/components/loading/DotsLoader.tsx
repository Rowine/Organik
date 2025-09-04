import React from 'react';
import { BaseLoadingProps } from '../../types/loading';

export const DotsLoader: React.FC<BaseLoadingProps> = ({
  size = "md",
  position = "center",
  message,
  className = "",
  color = "primary",
  showText = false,
  loadingText = "Loading",
}) => {

  const sizeConfig = {
    xs: {
      dot: "w-1 h-1",
      text: "text-xs",
      container: "p-1"
    },
    sm: {
      dot: "w-1.5 h-1.5",
      text: "text-sm",
      container: "p-2"
    },
    md: {
      dot: "w-2 h-2",
      text: "text-base",
      container: "p-3"
    },
    lg: {
      dot: "w-3 h-3",
      text: "text-lg",
      container: "p-4"
    },
    xl: {
      dot: "w-4 h-4",
      text: "text-xl",
      container: "p-6"
    }
  };

  const colorConfig = {
    primary: "bg-green-600",
    secondary: "bg-gray-600",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    error: "bg-red-600",
    neutral: "bg-gray-500"
  };


  const positionConfig = {
    center: "flex items-center justify-center",
    top: "flex items-start justify-center",
    bottom: "flex items-end justify-center",
    left: "flex items-center justify-start",
    right: "flex items-center justify-end"
  };

  const currentSize = sizeConfig[size];
  const currentColor = colorConfig[color];
  const currentPosition = positionConfig[position];

  return (
    <div className={`${currentPosition} ${currentSize.container} ${className}`}>
      <div className="flex items-center space-x-1">
        {(showText || message) && (
          <span className={`${currentSize.text} ${currentColor.replace('bg-', 'text-')} font-medium mr-2`}>
            {message || loadingText}
          </span>
        )}

        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`
                ${currentSize.dot} 
                ${currentColor} 
                rounded-full 
                animate-bounce
              `}
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '0.6s'
              }}
              role="img"
              aria-label={`Loading dot ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <span className="sr-only">
        {message || loadingText}
      </span>
    </div>
  );
};
