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
// @ts-ignore
import PreloadImage from 'react-preload-image'

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
          <div className='relative h-12 rounded-xl bg-green-900 drop-shadow-lg md:h-24'>
            <img
              src='/images/banner/bg-leaf.jpg'
              alt='Leaf pattern'
              className='absolute h-full w-full rounded-xl object-cover mix-blend-overlay'
            />
            <h2 className='p-2 text-center font-lato text-xl font-extrabold uppercase tracking-widest text-white md:p-7 md:text-3xl '>
              {category}
            </h2>
          </div>
          {loading === 'pending' ? (
            <div className='h-screen'>
              <Loader />
            </div>
          ) : error ? (
            <Message type={'error'}>{error}</Message>
          ) : (
            <div className='mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
              {categoryProducts.map((product: IProductItem) => (
                <div
                  key={product._id}
                  className='group relative rounded-xl p-1 shadow-lg sm:p-3'
                >
                  <div className='min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75'>
                    <Link to={`/${product.category}/${product._id}`}>
                      <PreloadImage
                        src={product.image}
                        className=' h-full w-full object-cover object-center'
                        lazy
                      />
                    </Link>
                  </div>
                  <div className='mt-4 sm:flex sm:justify-between'>
                    <div>
                      <h3 className='font-lato font-medium text-gray-700'>
                        <Link
                          to={`/${product.category}/${product._id}`}
                          className='font-semibold'
                        >
                          <span
                            aria-hidden='true'
                            className='absolute inset-0'
                          />
                          {product.name}
                        </Link>
                      </h3>
                      <div className='mt-1 truncate font-lato text-xs text-gray-500'>
                        <Rating
                          value={product.rating}
                          text={`${product.numReviews} reviews`}
                        />
                      </div>
                    </div>
                    <p className='mt-1 font-lato text-sm font-semibold text-gray-900 sm:mt-0'>
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
