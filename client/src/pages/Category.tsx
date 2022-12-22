import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
import Container from '../components/Container'
import IProductItem from '../interfaces/IProductItem'
import { listProducts } from '../features/productListSlice'
import { useAppDispatch, useAppSelector } from '../app/hooks'

const Category = () => {
  const dispatch = useAppDispatch()

  const productList = useAppSelector((state) => state.productList)
  const { loading, error, products } = productList

  const { category } = useParams()

  const metaCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'Category'
  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  const categoryProducts = products.filter(
    (product: IProductItem) => product.category === category
  )

  return (
    <>
      <Meta title={`Organik | ${metaCategory}`} />
      <div className='min-h-screen'>
        <Container>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 uppercase'>
            {category}
          </h2>
          {loading === 'pending' ? (
            <Loader />
          ) : error ? (
            <Message type={'error'}>{error}</Message>
          ) : (
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
                          <span
                            aria-hidden='true'
                            className='absolute inset-0'
                          />
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
          )}
        </Container>
      </div>
    </>
  )
}

export default Category
