import { Link } from 'react-router-dom'
import { useTrendingProducts, useCustomerPurchaseProducts } from '../hooks/useProducts'
import Rating from './Rating'
import Loader from './Loader'
import Message from './Message'
import { getUserFriendlyMessage } from '../utils/errorUtils'

const CategoryPreview = () => {
  // Use specialized hooks for different product sections
  const { trendingProducts, isLoading: trendingLoading, error: trendingError } = useTrendingProducts()
  const { customerPurchase, isLoading: customerLoading, error: customerError } = useCustomerPurchaseProducts()

  // Determine overall loading state
  const isLoading = trendingLoading || customerLoading
  const hasError = trendingError || customerError

  const ProductCard = ({ product }: { product: any }) => (
    <div
      key={product._id}
      className='group relative overflow-hidden rounded-3xl bg-white transition-all hover:shadow-2xl hover:-translate-y-1'
    >
      <div className='aspect-w-4 aspect-h-3 w-full mx-auto overflow-hidden'>
        <img
          src={product.image}
          alt={product.name}
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

          {trendingLoading ? (
            <div className='flex min-h-[300px] items-center justify-center'>
              <Loader />
            </div>
          ) : trendingError ? (
            <div className='mb-8'>
              <Message type='error'>
                {typeof trendingError === 'string' ? trendingError : getUserFriendlyMessage(trendingError)}
                . Please try again later.
              </Message>
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4 lg:gap-x-12'>
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

          {customerLoading ? (
            <div className='flex min-h-[300px] items-center justify-center'>
              <Loader />
            </div>
          ) : customerError ? (
            <div className='mb-8'>
              <Message type='error'>
                {typeof customerError === 'string' ? customerError : getUserFriendlyMessage(customerError)}
                . Please try again later.
              </Message>
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4 lg:gap-x-12'>
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
