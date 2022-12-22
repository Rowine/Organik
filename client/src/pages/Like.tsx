import React, { useEffect } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Message from '../components/Message'
import { addItemToLike, removeFromLike, addToLike } from '../features/likeSlice'

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

  return (
    <div className='min-h-screen'>
      <div className='bg-white'>
        <div className='mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 uppercase pb-10'>
            Likes
          </h2>
          <div className='grid grid-cols-1'>
            <div className='flex flex-col md:col-span-2'>
              <div>
                <div className='border-b border-gray-200'>
                  <h3 className='text-sm font-medium text-gray-900'>
                    {likeItems.length} items that you liked
                  </h3>

                  <div className='mt-6'>
                    {likeItems.length === 0 ? (
                      <Message type={'info'}>
                        You don't have any item that you like.{' '}
                        <Link
                          to='/'
                          className='text-indigo-600 hover:text-indigo-500 underline'
                        >
                          Go back
                        </Link>
                      </Message>
                    ) : (
                      <ul className='border-t border-b border-gray-200 divide-y divide-gray-200'>
                        {likeItems.map((item) => (
                          <li
                            key={item.product}
                            className='py-6 flex space-x-5 sm:space-x-10'
                          >
                            <div className='flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden'>
                              <img
                                src={item.image}
                                alt={item.name}
                                className='w-full h-full object-center object-cover'
                              />
                            </div>

                            <div className='ml-4 flex-1 flex flex-col'>
                              <div className='flex justify-between content-center text-base font-medium text-gray-900'>
                                <h3>
                                  <Link to={`/product/${item.product}`}>
                                    {item.name}
                                  </Link>
                                </h3>
                              </div>
                              <p className='font-semibold my-2'>
                                ₱{item.price}
                              </p>
                            </div>

                            <div className='ml-4 flex flex-col justify-center sm:flex-row'>
                              <button
                                type='button'
                                className='font-medium text-blue-600 hover:text-blue-500 mr-4'
                                onClick={() => addToCartHandler(item.product)}
                              >
                                Add to Cart
                              </button>
                              <button
                                type='button'
                                className='font-medium text-red-600 hover:text-red-500'
                                onClick={() =>
                                  removeCartItemHandler(item.product)
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Like
