import React, { useEffect } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Message from '../components/Message'
import { addItemToLike, removeFromLike, addToLike } from '../features/likeSlice'
import {
  HeartIcon,
  ArrowLeftIcon,
  ShoppingCartIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

const Like = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const { likeItems } = useAppSelector((state) => state.like)

  const { cartItems } = useAppSelector((state) => state.cart)

  useEffect(() => {
    if (id) {
      dispatch(addToLike({ id, qty }))
    }
  }, [dispatch, id, qty, cartItems])

  const removeCartItemHandler = (id: string) => {
    dispatch(removeFromLike(id))
  }

  const addToCartHandler = (id: string) => {
    dispatch(removeFromLike(id))
    navigate(`/cart/${id}?qty=${qty}`)
  }

  const EmptyState = () => (
    <div className='text-center py-16'>
      <div className='mx-auto w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6'>
        <HeartSolidIcon className="w-12 h-12 text-pink-500" />
      </div>
      <h3 className='text-2xl font-bold text-gray-900 mb-2'>Your wishlist is empty</h3>
      <p className='text-gray-600 mb-8 max-w-md mx-auto'>
        Start adding items to your wishlist by clicking the heart icon on products you love.
      </p>
      <Link
        to="/"
        className='inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-500 transition-colors'
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Continue Shopping
      </Link>
    </div>
  )



  return (
    <div className='bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>


        {likeItems.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className='mb-8'>
              <h2 className='text-2xl font-bold text-gray-900 sm:text-3xl mb-2'>
                Saved Items
              </h2>
              <p className='text-gray-600'>
                {likeItems.length} item{likeItems.length !== 1 ? 's' : ''} in your wishlist
              </p>
            </div>

            <div className='grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8'>
              {likeItems.map((item) => (
                <div
                  key={item.product}
                  className='group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1'
                >
                  <div className='aspect-w-4 aspect-h-3 w-full overflow-hidden'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
                  </div>

                  <div className='p-4 sm:p-6'>
                    <div className='flex flex-col space-y-3'>
                      <div className='flex items-start justify-between'>
                        <h3 className='font-lato text-lg font-medium text-gray-900 line-clamp-2'>
                          <Link to={`/product/${item.product}`} className='hover:text-green-600 transition-colors'>
                            {item.name}
                          </Link>
                        </h3>
                      </div>

                      <div className='flex items-center justify-between'>
                        <p className='font-lato text-xl font-bold text-green-600'>
                          ₱{item.price}
                        </p>
                        <button
                          onClick={() => removeCartItemHandler(item.product)}
                          className='p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50'
                          title='Remove from wishlist'
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>

                      <button
                        onClick={() => addToCartHandler(item.product)}
                        className='w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-500 transition-colors flex items-center justify-center space-x-2'
                      >
                        <ShoppingCartIcon className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to action */}
            <div className='mt-16 rounded-3xl bg-green-50 px-8 py-12 text-center'>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                Ready to make a purchase?
              </h3>
              <p className='text-gray-600 mb-6'>
                Add your favorite items to cart and enjoy fresh, organic products delivered to your door.
              </p>
              <Link
                to="/"
                className='inline-flex items-center px-6 py-3 border border-green-600 text-green-600 font-medium rounded-xl hover:bg-green-50 transition-colors'
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Like
