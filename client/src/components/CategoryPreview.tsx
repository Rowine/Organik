import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listProducts } from '../features/productListSlice'
import { useAppSelector, useAppDispatch } from '../app/hooks'

const CategoryPreview = () => {
  const dispatch = useAppDispatch()

  const productList = useAppSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  const trendingProducts = products.slice(0, 4)
  const customerPurchase = products.slice(5, 9)

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-2xl py-6 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8'>
        <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-gray-900'>
          Trending Products
        </h2>

        <div className='mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
          {trendingProducts.map((product) => (
            <div key={product._id} className='group relative'>
              <div className='min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='h-full w-full object-cover object-center lg:h-full lg:w-full'
                />
              </div>
              <div className='mt-4 flex justify-between'>
                <div>
                  <h3 className='text-sm text-gray-700'>
                    <Link to={`/${product.category}/${product._id}`}>
                      <span aria-hidden='true' className='absolute inset-0' />
                      {product.name}
                    </Link>
                  </h3>
                  <p className='mt-1 text-xs text-gray-500'>
                    {product.category.toLocaleUpperCase()}
                  </p>
                </div>
                <p className='text-sm font-medium text-gray-900'>
                  ₱{product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='mx-auto max-w-2xl py-6 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8'>
        <h2 className='text-3xl font-bold tracking-tight text-gray-900'>
          Customers also purchased
        </h2>

        <div className='mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
          {customerPurchase.map((product) => (
            <div key={product._id} className='group relative'>
              <div className='min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='h-full w-full object-cover object-center lg:h-full lg:w-full'
                />
              </div>
              <div className='mt-4 flex justify-between'>
                <div>
                  <h3 className='text-sm text-gray-700'>
                    <Link to={`/${product.category}/${product._id}`}>
                      <span aria-hidden='true' className='absolute inset-0' />
                      {product.name}
                    </Link>
                  </h3>
                  <p className='mt-1 text-xs text-gray-500'>
                    {product.category.toLocaleUpperCase()}
                  </p>
                </div>
                <p className='text-sm font-medium text-gray-900'>
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
