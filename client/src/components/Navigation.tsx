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
    <Disclosure as='nav' className='bg-white shadow-sm'>
      {({ open }) => (
        <>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='relative flex h-20 items-center justify-between'>
              <div className='absolute inset-y-0 left-0 flex items-center md:hidden'>
                {/* Mobile menu button*/}
                <Disclosure.Button className='inline-flex items-center justify-center p-2 text-gray-600 transition-colors hover:text-green-600 focus:outline-none'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XMarkIcon className='block h-7 w-7' aria-hidden='true' />
                  ) : (
                    <Bars3Icon className='block h-7 w-7' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
              <div className='flex flex-1 items-center justify-between md:justify-start'>
                {/* Logo */}
                <div className='flex flex-1 justify-center md:justify-start md:flex-initial'>
                  <Link to={'/'}>
                    <img
                      className='block h-10 w-auto'
                      src='/images/logo-dark.svg'
                      alt='Company Logo'
                    />
                  </Link>
                </div>
                {/* Categories - Center */}
                <div className='hidden flex-1 md:block'>
                  <div className='flex justify-center space-x-8'>
                    {category.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={classNames(
                          checkActive(item.path)
                            ? 'text-green-600'
                            : 'text-gray-600 hover:text-green-600',
                          'text-md px-1 py-2 font-medium transition-colors'
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
              <div className='absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0'>
                <Link to='/like'>
                  <button
                    type='button'
                    className='hidden rounded-lg p-2 text-gray-600 hover:bg-green-50 hover:text-green-600 md:block'
                  >
                    <span className='sr-only'>View Likes</span>
                    <HeartIcon
                      className='h-6 w-6'
                      aria-hidden='true'
                    />
                  </button>
                </Link>
                <Link to='/cart' className='ml-2'>
                  <button
                    type='button'
                    className='hidden rounded-lg p-2 text-gray-600 hover:bg-green-50 hover:text-green-600 md:block'
                  >
                    <span className='sr-only'>View Cart</span>
                    <ShoppingCartIcon
                      className='h-6 w-6'
                      aria-hidden='true'
                    />
                  </button>
                </Link>

                {/* Profile dropdown */}
                {userInfo ? (
                  <Menu as='div' className='relative ml-2'>
                    <div>
                      <Menu.Button className='flex rounded-lg p-2 text-gray-600 hover:bg-green-50 hover:text-green-600'>
                        <span className='sr-only'>Open user menu</span>
                        <UserCircleIcon
                          className='h-6 w-6'
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
                      <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none'>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to='/profile'
                              className={classNames(
                                active ? 'bg-green-50 text-green-600' : 'text-gray-700',
                                'block px-4 py-2 text-sm transition-colors'
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
                                active ? 'bg-green-50 text-green-600' : 'text-gray-700',
                                'block px-4 py-2 text-sm transition-colors md:hidden'
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
                                active ? 'bg-green-50 text-green-600' : 'text-gray-700',
                                'block px-4 py-2 text-sm transition-colors md:hidden'
                              )}
                            >
                              Cart
                            </Link>
                          )}
                        </Menu.Item>

                        {userInfo && userInfo.isAdmin && (
                          <>
                            <div className='my-2 border-t border-gray-100'></div>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to='/admin/userlist'
                                  className={classNames(
                                    active ? 'bg-green-50 text-green-600' : 'text-gray-700',
                                    'block px-4 py-2 text-sm transition-colors'
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
                                    active ? 'bg-green-50 text-green-600' : 'text-gray-700',
                                    'block px-4 py-2 text-sm transition-colors'
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
                                    active ? 'bg-green-50 text-green-600' : 'text-gray-700',
                                    'block px-4 py-2 text-sm transition-colors'
                                  )}
                                >
                                  Orders
                                </Link>
                              )}
                            </Menu.Item>
                          </>
                        )}
                        <div className='my-2 border-t border-gray-100'></div>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type='button'
                              className={classNames(
                                active ? 'bg-green-50 text-green-600' : 'text-gray-700',
                                'block w-full px-4 py-2 text-left text-sm transition-colors'
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
                  <div className='relative ml-2 hidden md:block'>
                    <Link
                      to='/login'
                      className='flex rounded-lg px-4 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors'
                    >
                      <span className='text-sm font-medium'>
                        Login
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className='md:hidden'>
            <div className='px-1 pb-3 pt-2'>
              <div className='space-y-1 px-3'>
                {category.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.path}
                    className={classNames(
                      checkActive(item.path)
                        ? 'text-green-600 font-semibold'
                        : 'text-gray-600 hover:text-green-600',
                      'block py-3 text-base font-medium transition-colors text-center border-b border-gray-100'
                    )}
                    aria-current={checkActive(item.path) ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>

              <div className='mt-4 flex justify-center space-x-6 px-3'>
                <Disclosure.Button
                  as={Link}
                  to={'/like'}
                  className='inline-flex items-center text-gray-600 hover:text-green-600 transition-colors'
                >
                  <HeartIcon className='h-6 w-6' aria-hidden='true' />
                  <span className='ml-2 text-base font-medium'>Likes</span>
                </Disclosure.Button>

                <Disclosure.Button
                  as={Link}
                  to={'/cart'}
                  className='inline-flex items-center text-gray-600 hover:text-green-600 transition-colors'
                >
                  <ShoppingCartIcon className='h-6 w-6' aria-hidden='true' />
                  <span className='ml-2 text-base font-medium'>Cart</span>
                </Disclosure.Button>
              </div>

              {!userInfo && (
                <div className='mt-4 px-3'>
                  <div className='border-t border-gray-100 pt-4'>
                    <Disclosure.Button
                      as={Link}
                      to='/login'
                      className='flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-base font-medium text-white hover:bg-green-700 transition-colors'
                    >
                      Login
                    </Disclosure.Button>
                  </div>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Navigation
