import React from 'react'
import Container from './Container'
import { PhoneIcon } from '@heroicons/react/24/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import Logo from '../assets/logo.svg'

const Footer = () => {
  return (
    <div className='w-full bg-green-600'>
      <Container>
        <div className='flex justify-between py-8 space-y-4 text-white'>
          <div>
            <img src={Logo} alt='logo' className='w-1/2' />
            <div>
              <h3 className='my-2 text-md font-semibold'>Follow Us</h3>
              <div className='flex space-x-2'>
                <a href='https://www.facebook.com'>
                  <FontAwesomeIcon
                    icon={faFacebook}
                    className='h-5 w-5 rounded-full p-1 bg-green-800'
                  />
                </a>
                <a href='https://www.instagram.com'>
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className='h-5 w-5 rounded-full p-1 bg-green-800'
                  />
                </a>
                <a href='https://www.twitter.com'>
                  <FontAwesomeIcon
                    icon={faTwitter}
                    className='h-5 w-5 rounded-full p-1 bg-green-800'
                  />
                </a>
              </div>
            </div>
            <h3 className='my-2 text-md font-semibold'>Contact Us</h3>
            <div className='flex'>
              <button className='h-7 w-7 rounded-full p-1 bg-green-800'>
                <PhoneIcon />
              </button>
              <span className='mx-2 font-bold font-sans'>+1 202-918-2132</span>
            </div>
          </div>
          <div>
            <form className='flex flex-col space-y-2'>
              <h2 className='text-xl font-semibold'>
                Subscribe to our Newsletter
              </h2>
              <input
                type='email'
                placeholder='Enter your Email'
                className='rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-600'
              />
              <button
                type='submit'
                className='bg-green-800 text-left px-2 py-1 w-fit rounded-md text-white'
              >
                Subscribe
              </button>
            </form>
            <p className='text-sm'>
              &copy; {new Date().getFullYear()} - All rights reserved
            </p>
            <p className='text-sm '>
              Made by{' '}
              <a href='https://github.com/Rowine' className='underline'>
                Rowine Mabiog
              </a>
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Footer
