import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Container from '../components/Container'
import { listProductDetails } from '../features/productDetailsSlice'
import {
  updateProduct,
  resetProductUpdate,
} from '../features/productUpdateSlice'
import IProductItem from '../interfaces/IProductItem'

const ProductEdit = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [uploading, setUploading] = useState(false)

  const navigate = useNavigate()
  const { id: productId } = useParams()

  const dispatch = useAppDispatch()
  const productDetails = useAppSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useAppSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch(resetProductUpdate())
      navigate('/admin/productlist')
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId as string))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setCategory(product.category)
        setCountInStock(product.countInStock)
      }
    }
  }, [dispatch, product, productId, successUpdate, navigate])

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const product = {
      _id: productId,
      name,
      price,
      image,
      category,
      countInStock,
    } as IProductItem
    dispatch(updateProduct(product))
  }

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)

      const path = '/' + data.split('/').slice(3).join('/')

      setImage(path)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }
  return (
    <Container>
      <div className='ml-4 sm:m-0'>
        <Link
          to='/admin/productlist'
          className='group relative my-3 flex w-fit justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
        >
          Go Back
        </Link>
      </div>
      <div className='mb-5 flex max-h-full items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-6'>
          <div>
            <h2 className='my-10 text-center text-4xl font-bold tracking-tight text-gray-900'>
              Edit Product
            </h2>
          </div>
          {loadingUpdate === 'pending' && <Loader />}
          {errorUpdate && <Message type='error'>{errorUpdate}</Message>}
          {loading === 'pending' ? (
            <Loader />
          ) : error ? (
            <Message type='error'>{error}</Message>
          ) : (
            <form className='space-y-6' onSubmit={submitHandler}>
              <input type='hidden' name='remember' defaultValue='true' />
              <div className='space-y-4 shadow-sm'>
                <div>
                  <label htmlFor='name'>Name</label>
                  <input
                    id='name'
                    name='name'
                    type='text'
                    autoComplete='name'
                    value={name}
                    className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-600 focus:outline-none focus:ring-green-600 sm:text-sm'
                    placeholder='Enter Name'
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor='price'>Price</label>
                  <input
                    id='price'
                    name='price'
                    type='number'
                    autoComplete='price'
                    min='0'
                    value={price}
                    step='any'
                    className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-600 focus:outline-none focus:ring-green-600 sm:text-sm'
                    placeholder='Enter Price'
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label htmlFor='image'>Image</label>
                  <input
                    id='image'
                    name='image'
                    type='text'
                    autoComplete='image'
                    value={image}
                    className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-600 focus:outline-none focus:ring-green-600 sm:text-sm'
                    placeholder='Enter Image Url'
                    onChange={(e) => setImage(e.target.value)}
                  />
                  <input
                    type='file'
                    id='image-file'
                    onChange={uploadFileHandler}
                    className='relative mt-2 block w-full appearance-none text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-600 focus:outline-none focus:ring-green-600 sm:text-sm'
                  />
                  {uploading && <Loader />}
                </div>
                <div>
                  <label htmlFor='countInStock'>Count In Stock</label>
                  <input
                    id='countInStock'
                    name='countInStock'
                    type='number'
                    autoComplete='countInStock'
                    min={0}
                    value={countInStock}
                    className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-600 focus:outline-none focus:ring-green-600 sm:text-sm'
                    placeholder='Enter Name'
                    onChange={(e) => setCountInStock(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label htmlFor='category'>Category</label>
                  <input
                    id='category'
                    name='category'
                    type='text'
                    autoComplete='category'
                    value={category}
                    className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-600 focus:outline-none focus:ring-green-600 sm:text-sm'
                    placeholder='Enter Category'
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  type='submit'
                  className='group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                >
                  Update
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Container>
  )
}

export default ProductEdit
