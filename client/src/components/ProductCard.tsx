import React from 'react'
import { Link } from 'react-router-dom'
import Rating from './Rating'
import IProductItem from '../interfaces/IProductItem'

interface ProductCardProps {
  product: IProductItem
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  return (
    <div className='group relative overflow-hidden rounded-3xl bg-white transition-all hover:shadow-2xl hover:-translate-y-1'>
      <div className='aspect-w-4 aspect-h-3 w-full mx-auto overflow-hidden'>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className='h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105'
        />
        {/* Overlay with gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
      </div>
      <div className='p-4 sm:p-5 md:p-6'>
        <div className='flex flex-col space-y-2 sm:space-y-3'>
          <div className='flex items-start justify-between'>
            <h3 className='font-lato sm:text-lg font-medium text-gray-900 line-clamp-1'>
              <Link to={`/product/${product._id}`}>
                <span aria-hidden='true' className='absolute inset-0' />
                {product.name}
              </Link>
            </h3>
            <p className='font-lato sm:text-lg font-bold text-green-600 pl-2 sm:pl-4'>
              ₱{product.price}
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  // Only re-render if these essential display properties change
  return (
    prevProps.product._id === nextProps.product._id &&
    prevProps.product.name === nextProps.product.name &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.rating === nextProps.product.rating &&
    prevProps.product.numReviews === nextProps.product.numReviews &&
    prevProps.product.image === nextProps.product.image
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
