import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listProducts } from '../features/productListSlice'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import Rating from './Rating'

const CategoryPreview = () => {
  const dispatch = useAppDispatch()

  const productList = useAppSelector((state) => state.productList)
  const { products } = productList

  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  const trendingProducts = products.slice(0, 4)
  const customerPurchase = products.slice(5, 9)

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-2xl py-6 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8'>
        <h2 className='text-2xl font-bold tracking-tight text-green-600 sm:text-3xl'>
          Trending Products
        </h2>

        <div className='mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
          {trendingProducts.map((product) => (
            <div
              key={product._id}
              className='group relative rounded-xl p-1 shadow-lg sm:p-3'
            >
              <div className='min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='h-full w-full object-cover object-center lg:h-full lg:w-full'
                />
              </div>
              <div className='mt-4 sm:flex sm:justify-between'>
                <div>
                  <h3 className='font-lato font-medium text-gray-700'>
                    <Link to={`/${product.category}/${product._id}`}>
                      <span aria-hidden='true' className='absolute inset-0' />
                      {product.name}
                    </Link>
                  </h3>
                  <p className='mt-1 truncate font-lato text-xs text-gray-500'>
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />
                  </p>
                </div>
                <p className='mt-1 font-lato text-sm font-semibold text-gray-900 sm:mt-0'>
                  ₱{product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='mx-auto max-w-2xl py-6 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8'>
        <h2 className='text-3xl font-bold tracking-tight text-green-600'>
          Customers also purchased
        </h2>

        <div className='mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
          {customerPurchase.map((product) => (
            <div
              key={product._id}
              className='group relative rounded-xl p-1 shadow-lg sm:p-3'
            >
              <div className='min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='h-full w-full object-cover object-center lg:h-full lg:w-full'
                />
              </div>
              <div className='mt-4 sm:flex sm:justify-between'>
                <div>
                  <h3 className='font-lato font-medium text-gray-700'>
                    <Link to={`/${product.category}/${product._id}`}>
                      <span aria-hidden='true' className='absolute inset-0' />
                      {product.name}
                    </Link>
                  </h3>
                  <p className='mt-1 font-lato text-xs text-gray-500'>
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />
                  </p>
                </div>
                <p className='mt-1 font-lato text-sm font-semibold text-gray-900 sm:mt-0'>
                  ₱{product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryPreview
