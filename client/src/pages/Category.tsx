import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import Rating from '../components/Rating'
import IProductItem from '../interfaces/IProductItem'

const Category = () => {
  const [products, setProducts] = useState([])
  const { category } = useParams()
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products')
      setProducts(data)
    }
    fetchProducts()
  }, [])

  const categoryProducts = products.filter(
    (product: IProductItem) => product.category === category
  )

  return (
    <div className='min-h-screen'>
      <div className='bg-white'>
        <div className='mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
          <h2 className='text-2xl font-bold tracking-tight text-gray-900 uppercase'>
            {category}
          </h2>

          <div className='mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
            {categoryProducts.map((product: IProductItem) => (
              <div key={product._id} className='group relative'>
                <div className='min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none'>
                  <Link to={`/${product.category}/${product._id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className='h-full w-full object-cover object-center lg:h-full lg:w-full'
                    />
                  </Link>
                </div>
                <div className='mt-4 flex justify-between'>
                  <div>
                    <h3 className='text-sm text-gray-700'>
                      <Link
                        to={`/${product.category}/${product._id}`}
                        className='font-semibold hover:underline'
                      >
                        <span aria-hidden='true' className='absolute inset-0' />
                        {product.name}
                      </Link>
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
