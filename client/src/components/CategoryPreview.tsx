import { Link } from 'react-router-dom'
import { useTrendingProducts, useCustomerPurchaseProducts } from '../hooks/useProducts'
import Rating from './Rating'
import Loader from './Loader'
import Message from './Message'
import { getUserFriendlyMessage } from '../utils/errorUtils'
import ProductCard from './ProductCard'

const CategoryPreview = () => {
  // Use specialized hooks for different product sections
  const { trendingProducts, isLoading: trendingLoading, error: trendingError } = useTrendingProducts()
  const { customerPurchase, isLoading: customerLoading, error: customerError } = useCustomerPurchaseProducts()

  // Determine overall loading state
  const isLoading = trendingLoading || customerLoading
  const hasError = trendingError || customerError

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
