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
        <div className='my-2 flex items-center justify-between'>
          <div>
            <h1 className='font-lato text-3xl font-bold uppercase tracking-tight text-gray-900'>
              Products
            </h1>
          </div>
          <div>
            <button
              type='button'
              className='group relative my-3 flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
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
          <table className='w-full table-fixed border-collapse shadow-md'>
            <thead>
              <tr className='bg-green-600 font-lato font-extrabold text-white'>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3 '>
                  ID
                </th>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  NAME
                </th>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3 '>
                  PRICE
                </th>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  CATEGORY
                </th>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  STOCKS
                </th>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className='bg-white last-of-type:border-b-2 last-of-type:border-green-600'>
              {products.map((product: IProductItem) => (
                <tr
                  key={product._id}
                  className='border-b border-slate-200 even:bg-gray-100'
                >
                  <td className='truncate text-xs text-slate-900  sm:p-4 sm:pl-8 md:text-sm lg:text-base '>
                    {product._id}
                  </td>
                  <td className='break-words  text-xs text-slate-900  sm:p-4 sm:pl-8 md:text-sm lg:text-base'>
                    {product.name}
                  </td>
                  <td className='break-words  text-xs text-slate-900  sm:p-4 sm:pl-8 md:text-sm lg:text-base'>
                    ₱{product.price}
                  </td>
                  <td className='truncate break-words  text-xs text-slate-900  sm:p-4 sm:pl-8 md:text-sm lg:text-base'>
                    {product.category}
                  </td>
                  <td className='break-words  text-xs text-slate-900  sm:p-4 sm:pl-8 md:text-sm lg:text-base'>
                    {product.countInStock}
                  </td>
                  <td className=' text-slate-900  sm:p-4 sm:pl-8'>
                    <div className='flex'>
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <button className='rounded-md bg-slate-200 p-1 hover:bg-slate-300 md:p-2'>
                          <FontAwesomeIcon icon={faEdit} className='w-3' />
                        </button>
                      </Link>
                      <button
                        className='smd:p-2 rounded-md bg-red-500 p-1 text-white  hover:bg-red-600 md:ml-2'
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className='w-3 text-white md:h-4 md:w-4'
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
