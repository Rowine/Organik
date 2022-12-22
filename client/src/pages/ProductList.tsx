import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Container from '../components/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'
import { listProducts } from '../features/productListSlice'
import { deleteProduct } from '../features/productDeleteSlice'
import {
  createProduct,
  resetProductCreate,
} from '../features/productCreateSlice'
import IProductItem from '../interfaces/IProductItem'

const ProductList = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const productList = useAppSelector((state) => state.productList)
  const { loading, error, products } = productList

  const productDelete = useAppSelector((state) => state.productDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete

  const productCreate = useAppSelector((state) => state.productCreate)
  const {
    loading: loadingCreate,
    product: createdProduct,
    success: successCreate,
    error: errorCreate,
  } = productCreate

  const { userInfo } = useAppSelector((state) => state.userLogin)

  useEffect(() => {
    dispatch(resetProductCreate())
    if (!userInfo) {
      navigate('/login')
    }
    if (successCreate) {
      navigate(`/admin/product/${createdProduct?._id}/edit`)
    } else {
      dispatch(listProducts())
    }
  }, [dispatch, navigate, userInfo, successCreate, successDelete])

  const deleteHandler = (id: string) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteProduct(id))
    }
  }

  const createProductHandler = () => {
    dispatch(createProduct())
  }

  return (
    <Container>
      <div>
        <div className='my-2 flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900 uppercase'>
              Products
            </h1>
          </div>
          <div>
            <button
              type='button'
              className='my-3 group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-center'
              onClick={createProductHandler}
            >
              <FontAwesomeIcon icon={faPlus} className='mr-2 mt-1' />
              Create Product
            </button>
          </div>
        </div>
        {loadingDelete === 'pending' && <Loader />}
        {errorDelete && <Message type='error'>{errorDelete}</Message>}
        {loadingCreate === 'pending' && <Loader />}
        {errorCreate && <Message type='error'>{errorCreate}</Message>}
        {loading === 'pending' ? (
          <Loader />
        ) : error ? (
          <Message type='error'>{error}</Message>
        ) : (
          <table className='table-fixed w-full xl:mx-auto xl:w-full xl:table-auto'>
            <thead>
              <tr>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left md:text-base text-xs '>
                  ID
                </th>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left md:text-base text-xs'>
                  NAME
                </th>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left md:text-base text-xs '>
                  PRICE
                </th>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 sm:text-left text-center md:text-base text-xs truncate'>
                  CATEGORY
                </th>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 sm:text-left text-center md:text-base text-xs'>
                  STOCKS
                </th>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left'></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: IProductItem) => (
                <tr key={product._id}>
                  <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900 break-words md:text-sm lg:text-base text-xs '>
                    {product._id}
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900 break-words md:text-sm lg:text-base text-xs'>
                    {product.name}
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900 break-words md:text-sm lg:text-base text-xs'>
                    ₱{product.price}
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900 break-words md:text-sm lg:text-base text-xs truncate'>
                    {product.category}
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900 break-words md:text-sm lg:text-base text-xs'>
                    {product.countInStock}
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900'>
                    <div className='flex'>
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <button className='bg-slate-200 p-1 hover:bg-slate-300 md:p-2 rounded-md'>
                          <FontAwesomeIcon icon={faEdit} className='w-3' />
                        </button>
                      </Link>
                      <button
                        className='md:ml-2 bg-red-500 hover:bg-red-600 p-1 smd:p-2  text-white rounded-md'
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className='text-white w-3 md:h-4 md:w-4'
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Container>
  )
}

export default ProductList
