const ProductSkeleton: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className='mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
      {Array.from({ length: count }).map((_, index) => (
        <div
          className='group relative rounded-xl p-1 shadow-lg sm:p-3'
          key={index}
        >
          <div className='min-h-80 aspect-w-1 aspect-h-1 w-full animate-pulse overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none'>
            <img
              height={240}
              width={240}
              className='h-full w-full border-0 object-cover object-center lg:h-full lg:w-full'
            />
          </div>
          <div className='mt-4 sm:flex sm:justify-between'>
            <div>
              <h3 className='h-5 w-24 animate-pulse bg-gray-200 font-lato font-medium'>
                <span aria-hidden='true' className='absolute inset-0' />
              </h3>
              <p className='mt-1 h-5 w-32 animate-pulse truncate bg-gray-200 font-lato text-xs'></p>
            </div>
            <p className='mt-1 h-5 w-14 animate-pulse bg-gray-200 font-lato text-sm font-semibold sm:mt-0'></p>
          </div>
        </div>
      ))}
    </div>
  )
}
export default ProductSkeleton
