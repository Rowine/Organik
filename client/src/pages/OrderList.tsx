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
import { format } from './Profile'

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
      <div className='min-h-screen'>
        <h1 className='my-8 font-lato text-3xl font-bold uppercase tracking-tight text-gray-900'>
          Orders
        </h1>
        {loading === 'pending' ? (
          <Loader />
        ) : error ? (
          <Message type='error'>{error}</Message>
        ) : (
          <table className='w-full table-fixed border-collapse shadow-md'>
            <thead>
              <tr className='bg-green-600 font-lato font-extrabold text-white'>
                <th className='pl-2 text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  ID
                </th>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  USER
                </th>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  DATE
                </th>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  TOTAL
                </th>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  PAID
                </th>
                <th className='break-words text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  DELIVERED
                </th>
                <th className='text-left font-medium sm:p-4 sm:pb-3 md:pl-8'>
                  DETAILS
                </th>
              </tr>
            </thead>
            <tbody className='bg-white last-of-type:border-b-2 last-of-type:border-green-600'>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className='border-b border-slate-200 even:bg-gray-100'
                >
                  <td className='truncate pl-2 pr-2 text-slate-900 sm:p-4 sm:pl-8'>
                    {order._id}
                  </td>
                  <td className='pr-2 text-slate-900 sm:p-4 sm:pl-8'>
                    {order.user && order.user.name}
                  </td>
                  <td className='break-words pr-2 text-slate-900 sm:p-4 sm:pl-8'>
                    {format(order.createdAt.substring(0, 10))}
                  </td>
                  <td className='break-words pr-2 text-slate-900 sm:p-4 sm:pl-8'>
                    ₱{order.totalPrice}
                  </td>
                  <td className='pr-2 text-center text-slate-900 sm:p-4 sm:pl-8 sm:text-left'>
                    {order.isPaid ? (
                      format(order.paidAt.substring(0, 10))
                    ) : (
                      <FontAwesomeIcon
                        icon={faTimes}
                        className='text-red-500'
                      />
                    )}
                  </td>
                  <td className='pr-2 text-center text-slate-900 sm:p-4 sm:pl-8 sm:text-left'>
                    {order.isDelivered ? (
                      format(order.deliveredAt.substring(0, 10))
                    ) : (
                      <FontAwesomeIcon
                        icon={faTimes}
                        className='text-red-500'
                      />
                    )}
                  </td>
                  <td className='text-white sm:p-4 md:pl-8'>
                    <div className='flex'>
                      <Link to={`/order/${order._id}`}>
                        <button className='rounded-md bg-green-600 p-1 hover:bg-green-900 md:p-2'>
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
