import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
import IProductItem from '../interfaces/IProductItem'
import { useProducts } from '../hooks/useProducts'

const Category = () => {
  const { category } = useParams()

  // Use the enhanced products hook with category filtering
  const {
    products: categoryProducts,
    isLoading,
    isInitialLoading,
    error,
    isStale,
    refetch
  } = useProducts({
    category,
    enableBackgroundRefresh: true
  })

  const metaCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'Category'

  const ProductCard = ({ product }: { product: IProductItem }) => (
    <div
      key={product._id}
      className='group relative overflow-hidden rounded-3xl bg-white transition-all hover:shadow-2xl hover:-translate-y-1'
    >
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

  const CategoryHeader = () => (
    <div className='relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-10 text-center shadow-2xl'>
      {/* Background image with overlay */}
      <img
        src='/images/banner/bg-leaf.jpg'
        alt='Organic leaf pattern'
        className='absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-overlay'
      />
      <div className='absolute inset-0 bg-gradient-to-r from-green-600/80 to-green-700/80' />

      <div className='relative z-10'>
        <span className='inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm mb-4 border border-white/20'>
          Fresh & Organic
        </span>
        <h1 className='text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl drop-shadow-lg'>
          {metaCategory}
        </h1>
        <p className='mt-4 text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md'>
          Discover our premium selection of fresh {category?.toLowerCase()} sourced directly from local farms
        </p>
      </div>

      {/* Enhanced decorative elements */}
      <div className='absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl' />
      <div className='absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl' />
      <div className='absolute top-1/2 left-1/4 w-20 h-20 bg-white/5 rounded-full blur-lg transform -translate-y-1/2' />
    </div>
  )

  const EmptyState = () => (
    <div className='text-center py-16'>
      <div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6'>
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 className='text-xl font-semibold text-gray-900 mb-2'>No products found</h3>
      <p className='text-gray-600 mb-8'>We're currently updating our {category} selection. Check back soon!</p>
      <Link
        to="/"
        className='inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-500 transition-colors'
      >
        Browse All Products
      </Link>
    </div>
  )

  return (
    <>
      <Meta title={`Organik | ${metaCategory}`} />
      <div className='bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <CategoryHeader />

          {isInitialLoading ? (
            <div className='flex min-h-[400px] items-center justify-center'>
              <Loader />
            </div>
          ) : error ? (
            <div className='mb-8'>
              <Message type='error'>{error}</Message>
            </div>
          ) : categoryProducts.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className='flex items-center justify-between mb-8'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
                    Fresh {metaCategory}
                  </h2>
                  <div className='flex items-center gap-4 mt-1'>
                    <p className='text-gray-600'>
                      {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} available
                    </p>
                    {isStale && (
                      <button
                        onClick={refetch}
                        className='inline-flex items-center text-sm text-green-600 hover:text-green-500 font-medium'
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                      </button>
                    )}
                  </div>
                </div>
                <div className='hidden sm:flex items-center space-x-4'>
                  <span className='text-sm text-gray-500'>Sort by:</span>
                  <select className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'>
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Customer Rating</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4 xl:gap-x-12'>
                {categoryProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Call to action section */}
              <div className='mt-16 rounded-3xl bg-green-50 px-8 py-12 text-center'>
                <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                  Can't find what you're looking for?
                </h3>
                <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
                  Our team is always adding new products. Contact us to request specific items or get notified when new {category} arrive.
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <button className='px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-500 transition-colors'>
                    Contact Us
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Category
