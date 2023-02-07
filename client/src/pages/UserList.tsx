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
      <div className='mb-10 max-h-screen'>
        <h1 className='my-8 font-lato text-3xl font-bold uppercase tracking-tight text-gray-900'>
          Users
        </h1>
        {loading === 'pending' ? (
          <Loader />
        ) : error ? (
          <Message type='error'>{error}</Message>
        ) : (
          <table className='w-full table-fixed border-collapse shadow-md'>
            <thead>
              <tr className='bg-green-600 font-lato font-extrabold text-white'>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  ID
                </th>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  NAME
                </th>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  EMAIL
                </th>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  ADMIN
                </th>
                <th className='text-left font-medium sm:p-4 sm:pl-8 sm:pb-3'>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className='bg-white last-of-type:border-b-2 last-of-type:border-green-600'>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className='border-b border-slate-200 even:bg-gray-100'
                >
                  <td className='truncate  text-slate-900  sm:p-4 sm:pl-8'>
                    {user._id}
                  </td>
                  <td className=' text-slate-900  sm:p-4 sm:pl-8'>
                    {user.name}
                  </td>
                  <td className='break-words  text-slate-900  sm:p-4 sm:pl-8'>
                    <a href={`mailto${user.email}`}>{user.email}</a>
                  </td>
                  <td className=' text-center text-slate-900  sm:p-4 sm:pl-8 sm:text-left'>
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
                  <td className='p-1 text-slate-900 sm:p-4 sm:pl-8'>
                    <div className='flex'>
                      <Link to={`/admin/user/${user._id}/edit`}>
                        <button className='rounded-md bg-slate-200 p-1 hover:bg-slate-300 sm:p-2'>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </Link>
                      <button
                        className='ml-2 rounded-md bg-red-500 p-1 text-white hover:bg-red-600 sm:p-2'
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className='h-4 w-4 text-white'
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
