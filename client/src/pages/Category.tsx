import React from 'react'
import { useParams } from 'react-router-dom'
import Rating from '../components/Rating'
// @ts-ignore
import products from '../products.js'

interface ProductItem {
  id: number
  name: string
  href: string
  imageSrc: string
  imageAlt: string
  price: number
  category: string
  countInStock: number
  rating: number
  numReviews: number
}

const Category = () => {
  const { category } = useParams()
  const categoryProducts = products.filter(
    (product: ProductItem) => product.category === category
  )

  return (
    <div className='min-h-screen'>
      <div className='bg-white'>
        <div className='mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
          <h2 className='text-2xl font-bold tracking-tight text-gray-900 uppercase'>
            {category}
          </h2>

          <div className='mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
            {categoryProducts.map((product: ProductItem) => (
              <div key={product.id} className='group relative'>
                <div className='min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80'>
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className='h-full w-full object-cover object-center lg:h-full lg:w-full'
                  />
                </div>
                <div className='mt-4 flex justify-between'>
                  <div>
                    <h3 className='text-sm text-gray-700'>
                      <a href={product.href} className='font-semibold'>
                        <span aria-hidden='true' className='absolute inset-0' />
                        {product.name}
                      </a>
                    </h3>
                    <div>
                      <Rating
                        value={product.rating}
                        text={`${product.numReviews} reviews`}
                      />
                    </div>
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
    </div>
  )
}

export default Category
