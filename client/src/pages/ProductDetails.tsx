import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import Rating from '../components/Rating'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as HeartFull } from '@fortawesome/free-solid-svg-icons'
import { faHeart as HeartEmpty } from '@fortawesome/free-regular-svg-icons'
import IProductItem, { IReview } from '../interfaces/IProductItem'
import { IParams } from '../interfaces/IParams'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { listProductDetails } from '../features/productDetailsSlice'
import { createProductReview } from '../features/productCreateReviewSlice'
import { resetProductCreateReview } from '../features/productCreateReviewSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'

const ProductDetails = () => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useAppDispatch()
  const productDetails = useAppSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productCreateReview = useAppSelector(
    (state) => state.productCreateReview
  )
  const {
    loading: loadingProductReview,
    error: errorProductReview,
    success: successProductReview,
  } = productCreateReview

  const { userInfo } = useAppSelector((state) => state.userLogin)

  const { likeItems } = useAppSelector((state) => state.like)

  const { id: productId } = useParams<keyof IParams>() as IParams

  useEffect(() => {
    if (successProductReview) {
      alert('Review Submitted!')
      setRating(0)
      setComment('')
      dispatch(resetProductCreateReview())
    }
    const listProductDetailsAction = async () => {
      try {
        const product = await dispatch(listProductDetails(productId)).unwrap()
      } catch (err) {
        console.log(err)
      }
    }
    listProductDetailsAction()
  }, [dispatch, successProductReview])

  const navigate = useNavigate()

  const addToCartHandler = () => {
    navigate(`/cart/${productId}?qty=${qty}`)
  }

  const addToLikeHandler = () => {
    navigate(`/like/${productId}?qty=${qty}`)
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const review = {
      name: userInfo?.name,
      rating,
      comment,
    } as IReview
    dispatch(createProductReview({ productId, review }))
    setRating(0)
    setComment('')
  }

  return (
    <>
      <Meta title={product.name} />
      <Container>
        <div className='py-10'>
          <Link to={`/${product.category}`}>
            <button className='bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded uppercase mb-4'>
              Back to {product.category}
            </button>
          </Link>
          {loading === 'pending' ? (
            <Loader />
          ) : error ? (
            <Message type='error'>{error}</Message>
          ) : (
            <>
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
                    Consectetur sequi ut at dolores autem, corporis voluptate
                    veniam quia qui non adipisci fugiat repellendus
                    exercitationem ullam praesentium. In aliquam harum facere?
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

                  <div className='grid grid-cols-4 gap-x-1 '>
                    <button
                      className={
                        product.countInStock === 0
                          ? 'bg-gray-500 text-white font-bold py-2 px-4 rounded col-span-3'
                          : 'bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded col-span-3'
                      }
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      {product.countInStock === 0
                        ? 'Out of Stock'
                        : 'Add to Cart'}
                    </button>

                    <button
                      className={
                        product.countInStock === 0
                          ? 'bg-gray-500 text-white font-bold py-2 px-4 rounded w-full relative'
                          : 'bg-rose-600 hover:bg-rose-800 text-white font-bold py-2 px-4 rounded relative '
                      }
                      disabled={product.countInStock === 0}
                      onClick={addToLikeHandler}
                    >
                      {likeItems.find(
                        (likeItem) => likeItem.product === product._id
                      ) ? (
                        <FontAwesomeIcon icon={HeartFull} className='h-5 w-5' />
                      ) : (
                        <FontAwesomeIcon
                          icon={HeartEmpty}
                          className='h-5 w-5'
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-x-5'>
                <div className='col-span-2'>
                  <h2 className='text-2xl font-bold tracking-tight text-gray-900 mt-5'>
                    Reviews
                  </h2>
                  {product.reviews.length === 0 && (
                    <Message type='info'>No Reviews</Message>
                  )}
                  <div className='mt-5 '>
                    {product.reviews.map((review) => (
                      <div key={review._id} className='mb-3 pb-2 border-b-2'>
                        <div className='flex items-center'>
                          <p className='text-gray-500 mr-1'>{review.name}</p>
                          <Rating value={review.rating} />
                        </div>
                        <p className='text-gray-500'>
                          {review.createdAt.substring(0, 10)}
                        </p>
                        <p className='text-gray-500'>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='col-span-1'>
                  <h2 className='text-2xl font-bold tracking-tight text-gray-900 mt-5'>
                    Write a Customer Review
                  </h2>
                  {successProductReview && (
                    <Message type='success'>
                      Review submitted successfully
                    </Message>
                  )}
                  {loadingProductReview === 'pending' && <Loader />}
                  {errorProductReview && (
                    <Message type='error'>{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <form
                      className='mt-5'
                      onSubmit={submitHandler}
                      autoComplete='off'
                    >
                      <div className='mb-5'>
                        <label
                          htmlFor='rating'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Rating
                        </label>
                        <select
                          id='rating'
                          name='rating'
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className='mt-1 block w-full py-3 px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </select>
                      </div>
                      <div className='mb-5'>
                        <label
                          htmlFor='comment'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Comment
                        </label>
                        <div className='mt-1'>
                          <textarea
                            id='comment'
                            name='comment'
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className='shadow-sm focus:ring-green-500 focus:border-green-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md'
                            placeholder='Write your review here'
                          />
                        </div>
                      </div>
                      <div>
                        <button
                          type='submit'
                          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  ) : (
                    <Message type='info'>
                      Please <Link to='/login'>sign in</Link> to write a review{' '}
                    </Message>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
    </>
  )
}

export default ProductDetails
