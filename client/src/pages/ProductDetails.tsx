import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import Rating from '../components/Rating'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as HeartFull } from '@fortawesome/free-solid-svg-icons'
import { faHeart as HeartEmpty } from '@fortawesome/free-regular-svg-icons'
import IProductItem from '../interfaces/IProductItem'
import { IParams } from '../interfaces/IParams'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { listProductDetails } from '../features/productDetailsSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'

const ProductDetails = () => {
  const [qty, setQty] = useState(1)

  const dispatch = useAppDispatch()
  const productDetails = useAppSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const { id } = useParams<keyof IParams>() as IParams

  useEffect(() => {
    const listProductDetailsAction = async () => {
      try {
        const product = await dispatch(listProductDetails(id)).unwrap()
      } catch (err) {
        console.log(err)
      }
    }
    listProductDetailsAction()
  }, [])

  const navigate = useNavigate()

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`)
  }

  return (
    <Container>
      <div className='py-16 sm:py-24'>
        <Link to={`/${product.category}`}>
          <button className='bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded uppercase'>
            Back to {product.category}
          </button>
        </Link>
        {loading === 'pending' ? (
          <Loader />
        ) : error ? (
          <Message type='error'>{error}</Message>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-x-2'>
            <div className='col-span-2'>
              <div className='aspect-w-3 aspect-h-2 overflow-hidden rounded-lg lg:block'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='h-full w-full object-contain object-center'
                />
              </div>
            </div>
            <div className='flex flex-col space-y-5 mt-5'>
              <Rating value={product.rating} />
              <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
                {product.name}
              </h1>
              <p className='text-gray-500 text-lg font-bold'>
                ₱{product.price}
              </p>
              <p className='text-gray-500'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consectetur sequi ut at dolores autem, corporis voluptate veniam
                quia qui non adipisci fugiat repellendus exercitationem ullam
                praesentium. In aliquam harum facere?
              </p>
              <p className='text-gray-500'>
                In Stock:{' '}
                <span className='font-bold'>{product.countInStock}</span>
              </p>

              {product.countInStock > 0 && (
                <div className=''>
                  <select
                    className='form-select px-4 py-3 rounded-full w-1/3 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent'
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className='grid grid-cols-4 gap-x-1'>
                <button
                  className={
                    product.countInStock === 0
                      ? 'bg-gray-500 text-white font-bold py-2 px-4 rounded col-span-3'
                      : 'bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded col-span-3'
                  }
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <button
                  className={
                    product.countInStock === 0
                      ? 'bg-gray-500 text-white font-bold py-2 px-4 rounded w-full'
                      : 'bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded '
                  }
                  disabled={product.countInStock === 0}
                >
                  <FontAwesomeIcon icon={HeartEmpty} className='h-5 w-5' />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

export default ProductDetails
