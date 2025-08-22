import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import Rating from '../components/Rating'
import IProductItem, { IReview } from '../interfaces/IProductItem'
import { IParams } from '../interfaces/IParams'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { listProductDetails } from '../features/productDetailsSlice'
import { createProductReview } from '../features/productCreateReviewSlice'
import { resetProductCreateReview } from '../features/productCreateReviewSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
// @ts-ignore
import PreloadImage from 'react-preload-image'

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
    dispatch(listProductDetails(productId))
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

  const ReviewCard = ({ review }: { review: IReview }) => (
    <div className='bg-white rounded-2xl p-6 shadow-lg ring-1 ring-gray-200 mb-4'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
            <span className='text-green-600 font-semibold text-sm'>
              {review.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className='font-medium text-gray-900'>{review.name}</p>
            <p className='text-sm text-gray-500'>{review.createdAt.substring(0, 10)}</p>
          </div>
        </div>
        <Rating value={review.rating} />
      </div>
      <p className='text-gray-700 leading-relaxed'>{review.comment}</p>
    </div>
  )

  return (
    <>
      <Meta title={product.name} />
      <div className='bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          {/* Back Button */}
          <Link
            to={`/${product.category}`}
            className='inline-flex items-center space-x-2 text-green-600 hover:text-green-500 transition-colors mb-8'
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className='font-medium'>Back to {product.category}</span>
          </Link>

          {loading === 'pending' ? (
            <div className='flex min-h-[400px] items-center justify-center'>
              <Loader />
            </div>
          ) : error ? (
            <div className='mb-8'>
              <Message type='error'>{error}</Message>
            </div>
          ) : (
            <>
              {/* Product Details Section */}
              <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 mb-16'>
                {/* Left Side - Product Image */}
                <div className='space-y-6'>
                  {/* Product Image */}
                  <div className='relative'>
                    <div className='aspect-w-4 aspect-h-3 overflow-hidden rounded-3xl bg-white shadow-2xl'>
                      <PreloadImage
                        src={product.image}
                        alt={product.name}
                        className='h-full w-full object-contain object-center'
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side - Product Details and Actions */}
                <div className='flex flex-col'>
                  <div className='bg-white rounded-2xl p-6 shadow-lg ring-1 ring-gray-200'>
                    {/* Product Info */}
                    <div className='mb-6'>
                      <div className='flex items-center space-x-2 mb-4'>
                        <Rating value={product.rating} />
                        <span className='text-sm text-gray-500'>
                          ({product.numReviews} reviews)
                        </span>
                      </div>
                      <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4'>
                        {product.name}
                      </h1>
                      <p className='text-3xl font-bold text-green-600 mb-6'>
                        ₱{product.price}
                      </p>
                    </div>

                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Product Details</h3>
                    <p className='text-gray-700 leading-relaxed mb-6'>
                      Fresh, organic produce sourced directly from local farms. This premium quality {' '}
                      {product.category.toLowerCase()} is carefully selected to ensure the best taste and nutritional value.
                    </p>

                    <div className='flex items-center space-x-4 mb-6'>
                      <span className='text-sm font-medium text-gray-700'>Availability:</span>
                      {product.countInStock > 0 ? (
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                          In Stock ({product.countInStock} available)
                        </span>
                      ) : (
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {product.countInStock > 0 && (
                      <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Quantity
                        </label>
                        <select
                          className='rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 w-32'
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className='flex space-x-4'>
                      <button
                        className={`flex-1 flex items-center justify-center space-x-2 rounded-xl py-4 px-6 font-medium transition-all ${product.countInStock === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-500 hover:shadow-lg'
                          }`}
                        disabled={product.countInStock === 0}
                        onClick={addToCartHandler}
                      >
                        <ShoppingCartIcon className="w-5 h-5" />
                        <span>
                          {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </span>
                      </button>

                      <button
                        className={`flex items-center justify-center rounded-xl py-4 px-6 transition-all ${product.countInStock === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-pink-600 text-white hover:bg-pink-500 hover:shadow-lg'
                          }`}
                        disabled={product.countInStock === 0}
                        onClick={addToLikeHandler}
                      >
                        {likeItems.find((likeItem) => likeItem.product === product._id) ? (
                          <HeartSolidIcon className="w-6 h-6" />
                        ) : (
                          <HeartIcon className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews and Write Review Section */}
              <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
                {/* Reviews */}
                <div className='lg:col-span-2'>
                  <div className='flex items-center justify-between mb-8'>
                    <h2 className='text-3xl font-bold text-gray-900'>
                      Customer Reviews
                    </h2>
                    <span className='text-sm text-gray-500'>
                      {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {product.reviews.length === 0 ? (
                    <div className='text-center py-12'>
                      <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                        <StarIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>No reviews yet</h3>
                      <p className='text-gray-600'>Be the first to share your thoughts about this product.</p>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {product.reviews.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Write Review */}
                <div>
                  <div className='bg-white rounded-2xl p-6 shadow-lg ring-1 ring-gray-200 sticky top-8'>
                    <h3 className='text-xl font-bold text-gray-900 mb-4'>
                      Write a Review
                    </h3>

                    {successProductReview && (
                      <Message type='success'>Review submitted successfully</Message>
                    )}
                    {loadingProductReview === 'pending' && <Loader />}
                    {errorProductReview && (
                      <Message type='error'>{errorProductReview}</Message>
                    )}

                    {userInfo ? (
                      <form onSubmit={submitHandler} className='space-y-4'>
                        <div>
                          <label htmlFor='rating' className='block text-sm font-medium text-gray-700 mb-2'>
                            Rating
                          </label>
                          <select
                            id='rating'
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className='w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                          >
                            <option value=''>Select rating...</option>
                            <option value='1'>⭐ 1 - Poor</option>
                            <option value='2'>⭐⭐ 2 - Fair</option>
                            <option value='3'>⭐⭐⭐ 3 - Good</option>
                            <option value='4'>⭐⭐⭐⭐ 4 - Very Good</option>
                            <option value='5'>⭐⭐⭐⭐⭐ 5 - Excellent</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor='comment' className='block text-sm font-medium text-gray-700 mb-2'>
                            Your Review
                          </label>
                          <textarea
                            id='comment'
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className='w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500'
                            placeholder='Share your experience with this product...'
                          />
                        </div>

                        <button
                          type='submit'
                          className='w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-500 transition-colors'
                        >
                          Submit Review
                        </button>
                      </form>
                    ) : (
                      <div className='text-center py-6'>
                        <p className='text-gray-600 mb-4'>
                          Sign in to write a review
                        </p>
                        <Link
                          to='/login'
                          className='inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-colors'
                        >
                          Sign In
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductDetails
