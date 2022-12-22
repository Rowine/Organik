import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Container from '../components/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTimes,
  faCheck,
  faTrash,
  faEdit,
} from '@fortawesome/free-solid-svg-icons'
import { listOrders } from '../features/orderListSlice'

const OrderList = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, orders } = useAppSelector((state) => state.orderList)

  const { userInfo } = useAppSelector((state) => state.userLogin)

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login')
    } else {
      dispatch(listOrders())
    }
  }, [dispatch, userInfo])

  return (
    <Container>
      <div className='py-10 h-screen'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 uppercase'>
          Orders
        </h1>
        {loading === 'pending' ? (
          <Loader />
        ) : error ? (
          <Message type='error'>{error}</Message>
        ) : (
          <table className='table-fixed w-full xl:mx-auto xl:w-max xl:table-auto'>
            <thead>
              <tr>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left'>
                  ID
                </th>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left'>
                  USER
                </th>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left'>
                  DATE
                </th>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 sm:text-left text-center'>
                  TOTAL
                </th>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 sm:text-left text-center'>
                  PAID
                </th>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left'>
                  Delivered
                </th>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left'></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className='border-b border-slate-200 dark:border-slate-600 pr-2 sm:p-4 sm:pl-8 text-slate-900 break-words'>
                    {order._id}
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 pr-2 sm:p-4 sm:pl-8 text-slate-900'>
                    {order.user && order.user.name}
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 pr-2 sm:p-4 sm:pl-8 text-slate-900 break-words'>
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 pr-2 sm:p-4 sm:pl-8 text-slate-900 break-words'>
                    ₱{order.totalPrice}
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 pr-2 sm:p-4 sm:pl-8 text-slate-900 text-center sm:text-left'>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FontAwesomeIcon
                        icon={faTimes}
                        className='text-red-500'
                      />
                    )}
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 pr-2 sm:p-4 sm:pl-8 text-slate-900 text-center sm:text-left'>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FontAwesomeIcon
                        icon={faTimes}
                        className='text-red-500'
                      />
                    )}
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 pr-2 sm:p-4 sm:pl-8 text-slate-900'>
                    <div className='flex'>
                      <Link to={`/order/${order._id}`}>
                        <button className='bg-slate-200 hover:bg-slate-300 p-2 rounded-md'>
                          Details
                        </button>
                      </Link>
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

export default OrderList
