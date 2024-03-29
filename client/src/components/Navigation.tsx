import React, { Fragment, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  HeartIcon,
  ShoppingCartIcon,
  XMarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { logout } from '../features/userLoginSlice'
import { resetOrderListMy } from '../features/orderListMySlice'
import { resetUserDetails } from '../features/userDetailsSlice'
import { resetCart } from '../features/cartSlice'
import { userListReset } from '../features/userListSlice'

interface INavigationProps {
  category: Array<{
    name: string
    path: string
    active: boolean
  }>
}

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ')
}

const Navigation: React.FC<INavigationProps> = ({ category }) => {
  const location = useLocation()
  const { userInfo } = useAppSelector((state) => state.userLogin)
  const checkActive = (path: string) => {
    return path === location.pathname
  }

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const logoutHandler = () => {
    dispatch(logout())
    dispatch(resetOrderListMy())
    dispatch(resetUserDetails())
    dispatch(resetCart())
    dispatch(userListReset())
    navigate('/login')
  }

  return (
    <Disclosure as='nav' className='ring-2 ring-slate-100'>
      {({ open }) => (
        <>
          <div className='mx-auto max-w-7xl px-2 pt-2 sm:px-6 lg:px-8'>
            <div className='relative flex h-16 items-center justify-between'>
              <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                {/* Mobile menu button*/}
                <Disclosure.Button className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
              <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
                <div className='flex flex-shrink-0 items-center'>
                  <Link to={'/'}>
                    <img
                      className='block h-8 w-auto lg:hidden'
                      src='/images/logo-dark.svg'
                      alt='Company Logo'
                    />
                  </Link>
                  <Link to={'/'}>
                    <img
                      className='hidden h-8 w-auto lg:block'
                      src='/images/logo-dark.svg'
                      alt='Company Logo'
                    />
                  </Link>
                </div>
                <div className='hidden sm:ml-6 sm:block'>
                  <div className='flex space-x-1 md:space-x-4 '>
                    {category.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={classNames(
                          checkActive(item.path)
                            ? 'bg-green-700 text-white'
                            : 'text-slate-500 hover:bg-green-700 hover:text-white',
                          'text-md rounded-lg px-2 py-2 font-lato font-bold tracking-wider lg:px-6'
                        )}
                        aria-current={
                          checkActive(item.path) ? 'page' : undefined
                        }
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className='absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:mr-2 sm:ml-6'>
                <Link to='/like'>
                  <button
                    type='button'
                    className=' hidden rounded-full text-green-600 hover:bg-green-700 hover:text-white sm:block sm:py-2 sm:px-3'
                  >
                    <span className='sr-only'>View Likes</span>
                    <HeartIcon
                      className='mt-1 h-5 w-5 stroke-2 sm:h-6 sm:w-6'
                      aria-hidden='true'
                    />
                  </button>
                </Link>
                <Link to='/cart' className='ml-1'>
                  <button
                    type='button'
                    className='hidden rounded-full text-green-600 hover:bg-green-700 hover:text-white sm:block sm:py-2 sm:px-3'
                  >
                    <span className='sr-only'>View Cart</span>
                    <ShoppingCartIcon
                      className='mt-1 h-5 w-5 stroke-2 sm:h-6 sm:w-6'
                      aria-hidden='true'
                    />
                  </button>
                </Link>

                {/* Profile dropdown */}
                {userInfo ? (
                  <Menu as='div' className='relative'>
                    <div>
                      <Menu.Button className='flex rounded-full p-1 text-green-600 hover:bg-green-700 hover:text-white sm:py-2 sm:px-3 md:block'>
                        <span className='sr-only'>Open user menu</span>
                        <UserCircleIcon
                          className='h-8 w-8 stroke-2 sm:mt-1 sm:h-6 sm:w-6'
                          aria-hidden='true'
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter='transition ease-out duration-100'
                      enterFrom='transform opacity-0 scale-95'
                      enterTo='transform opacity-100 scale-100'
                      leave='transition ease-in duration-75'
                      leaveFrom='transform opacity-100 scale-100'
                      leaveTo='transform opacity-0 scale-95'
                    >
                      <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to='/profile'
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Your Profile & Orders
                            </Link>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to='/like'
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 sm:hidden'
                              )}
                            >
                              Likes
                            </Link>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to='/cart'
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 sm:hidden'
                              )}
                            >
                              Cart
                            </Link>
                          )}
                        </Menu.Item>

                        {userInfo && userInfo.isAdmin && (
                          <>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to='/admin/userlist'
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  Users
                                </Link>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to='/admin/productlist'
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  Products
                                </Link>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to='/admin/orderlist'
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  Orders
                                </Link>
                              )}
                            </Menu.Item>
                          </>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type='button'
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block w-full px-4 py-2 text-left text-sm text-gray-700'
                              )}
                              onClick={logoutHandler}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className='relative ml-1'>
                    <Link
                      to='/login'
                      className='flex rounded-lg p-2 text-green-600 hover:bg-green-700 hover:text-white'
                    >
                      <span className='font-lato text-sm font-bold sm:tracking-wider'>
                        Login
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className='sm:hidden'>
            <div className='space-y-1 px-2 pt-2 pb-3'>
              {category.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.path}
                  className={classNames(
                    checkActive(item.path)
                      ? 'bg-green-700 text-white'
                      : 'text-green-600 hover:bg-green-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={checkActive(item.path) ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <div>
                <Disclosure.Button
                  as={Link}
                  to={'/like'}
                  className={classNames(
                    checkActive('/like')
                      ? 'bg-green-700 text-white'
                      : 'text-green-600 hover:bg-green-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                >
                  Likes
                </Disclosure.Button>
              </div>
              <div>
                <Disclosure.Button
                  as={Link}
                  to={'/cart'}
                  className={classNames(
                    checkActive('/cart')
                      ? 'bg-green-700 text-white'
                      : 'text-green-600 hover:bg-green-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                >
                  Cart
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Navigation
