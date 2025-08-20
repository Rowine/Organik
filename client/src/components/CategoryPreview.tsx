import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listProducts } from '../features/productListSlice'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import Rating from './Rating'
import ProductSkeleton from './ProductSkeleton'
// @ts-ignore
import PreloadImage from 'react-preload-image'
import Loader from './Loader'

const CategoryPreview = () => {
  const dispatch = useAppDispatch()

  const productList = useAppSelector((state) => state.productList)
  const { products, loading } = productList

  useEffect(() => {
    dispatch(listProducts())
  }, [])

  const trendingProducts = products.slice(0, 4)
  const customerPurchase = products.slice(5, 9)

  const ProductCard = ({ product }: { product: any }) => (
    <div
      key={product._id}
      className='group relative overflow-hidden rounded-3xl bg-white transition-all hover:shadow-2xl hover:-translate-y-1'
    >
      <div className='aspect-w-1 aspect-h-1 w-full overflow-hidden'>
        <PreloadImage
          src={product.image}
          className='h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105'
        />
        {/* Overlay with gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
      </div>
      <div className='p-6'>
        <div className='flex flex-col space-y-3'>
          <div className='flex items-start justify-between'>
            <h3 className='font-lato text-lg font-medium text-gray-900 line-clamp-1'>
              <Link to={`/${product.category}/${product._id}`}>
                <span aria-hidden='true' className='absolute inset-0' />
                {product.name}
              </Link>
            </h3>
            <p className='font-lato text-xl font-bold text-green-600 pl-4'>
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

  const SectionHeader = ({ subtitle, title }: { subtitle: string; title: string }) => (
    <div className='flex flex-col space-y-3 text-center mb-12'>
      <span className='inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-600 mx-auto'>
        {subtitle}
      </span>
      <h2 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
        {title}
      </h2>
    </div>
  )

  return (
    <div className='w-full'>
      <div className='bg-gradient-to-br from-gray-50 via-white to-gray-50'>
        <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
          <SectionHeader subtitle="Our Selection" title="Trending Products" />

          {loading === 'pending' ? (
            <div className='flex min-h-[300px] items-center justify-center'>
              <Loader />
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4'>
              {trendingProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='bg-gray-100'>
        <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
          <SectionHeader subtitle="Popular Choices" title="Customers Also Purchased" />

          {loading === 'pending' ? (
            <div className='flex min-h-[300px] items-center justify-center'>
              <Loader />
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4'>
              {customerPurchase.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryPreview
