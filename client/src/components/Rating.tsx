import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import {
  faStar as faStarRegular,
  faStarHalfStroke,
} from '@fortawesome/free-regular-svg-icons'

interface RatingProps {
  value: number
  text?: string
  color?: string
}

const Rating: React.FC<RatingProps> = ({ value, text, color }) => {
  return (
    <div className='flex justify-between'>
      <div className='flex space-x-0.5'>
        <span className='mx-0.5'>
          <FontAwesomeIcon
            icon={
              value >= 1
                ? faStar
                : value >= 0.5
                ? faStarHalfStroke
                : faStarRegular
            }
            className={color ? `text-${color}-500` : 'text-yellow-500'}
          />
        </span>
        <span>
          <FontAwesomeIcon
            icon={
              value >= 2
                ? faStar
                : value >= 1.5
                ? faStarHalfStroke
                : faStarRegular
            }
            className={color ? `text-${color}-500` : 'text-yellow-500'}
          />
        </span>
        <span>
          <FontAwesomeIcon
            icon={
              value >= 3
                ? faStar
                : value >= 2.5
                ? faStarHalfStroke
                : faStarRegular
            }
            className={color ? `text-${color}-500` : 'text-yellow-500'}
          />
        </span>
        <span>
          <FontAwesomeIcon
            icon={
              value >= 4
                ? faStar
                : value >= 3.5
                ? faStarHalfStroke
                : faStarRegular
            }
            className={color ? `text-${color}-500` : 'text-yellow-500'}
          />
        </span>
        <span>
          <FontAwesomeIcon
            icon={
              value >= 5
                ? faStar
                : value >= 4.5
                ? faStarHalfStroke
                : faStarRegular
            }
            className={color ? `text-${color}-500` : 'text-yellow-500'}
          />
        </span>
      </div>
      <span className='ml-1 md:ml-2'>{text && text}</span>
    </div>
  )
}

export default Rating
