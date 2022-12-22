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
import { listUsers } from '../features/userListSlice'
import { deleteUser } from '../features/userDeleteSlice'

const UserList = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, users } = useAppSelector((state) => state.userList)

  const { userInfo } = useAppSelector((state) => state.userLogin)

  const { loading: loadingDelete } = useAppSelector((state) => state.userDelete)

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login')
    } else {
      dispatch(listUsers())
    }
  }, [dispatch, loadingDelete])

  const deleteHandler = (id: string) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteUser(id))
    }
  }

  return (
    <Container>
      <div className='py-10 h-screen'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 uppercase'>
          Users
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
                  NAME
                </th>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left'>
                  EMAIL
                </th>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 sm:text-left text-center'>
                  ADMIN
                </th>
                <th className='border-b dark:border-slate-600 font-medium sm:p-4 sm:pl-8 sm:pt-0 sm:pb-3 text-slate-900 text-left'></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900 break-words'>
                    {user._id}
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900'>
                    {user.name}
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900 break-words'>
                    <a href={`mailto${user.email}`}>{user.email}</a>
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900 text-center sm:text-left'>
                    {user.isAdmin ? (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className='text-green-500'
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faTimes}
                        className='text-red-500'
                      />
                    )}
                  </td>
                  <td className='border-b border-slate-200 dark:border-slate-600 sm:p-4 sm:pl-8 text-slate-900'>
                    <div className='flex'>
                      <Link to={`/admin/user/${user._id}/edit`}>
                        <button className='bg-slate-200 hover:bg-slate-300 p-2 rounded-md'>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </Link>
                      <button
                        className='ml-2 bg-red-500 hover:bg-red-600 p-2 rounded-md text-white'
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className='text-white h-4 w-4'
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

export default UserList
