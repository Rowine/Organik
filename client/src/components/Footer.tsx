import Container from './Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'

import { faPhone } from '@fortawesome/free-solid-svg-icons'

const Footer = () => {
  return (
    <footer className='w-full bg-green-600'>
      <Container>
        <div className='flex justify-between space-x-10 py-8 text-white'>
          <div className='lg:flex lg:items-start lg:justify-between lg:space-x-10'>
            <img
              src='/images/logo-light.svg'
              alt='logo'
              width={200}
              className=''
            />
            <div>
              <h3 className='text-md my-2 font-semibold'>Follow Us</h3>
              <div className='flex space-x-2'>
                <a href='https://www.facebook.com'>
                  <FontAwesomeIcon
                    icon={faFacebook}
                    className='h-5 w-5 rounded-full bg-green-800 p-1'
                  />
                </a>
                <a href='https://www.instagram.com'>
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className='h-5 w-5 rounded-full bg-green-800 p-1'
                  />
                </a>
                <a href='https://www.twitter.com'>
                  <FontAwesomeIcon
                    icon={faTwitter}
                    className='h-5 w-5 rounded-full bg-green-800 p-1'
                  />
                </a>
              </div>
            </div>
            <div className='flex flex-col'>
              <h3 className='text-md my-2 font-semibold'>Contact Us</h3>
              <div className='flex'>
                <FontAwesomeIcon
                  icon={faPhone}
                  className='h-5 w-5 rounded-full bg-green-800 p-1'
                />

                <p className='font-sans mx-2 text-sm font-bold'>
                  +1 202-918-2132
                </p>
              </div>
            </div>
          </div>
          <div>
            <form className='flex flex-col space-y-2'>
              <h2 className='text-md font-semibold sm:text-xl'>
                Subscribe to our Newsletter
              </h2>
              <input
                type='email'
                placeholder='Enter your Email'
                className='w-full rounded-md p-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-800 md:p-2'
              />
              <button
                type='submit'
                className='w-fit rounded-md bg-green-800 px-2 py-1 text-left text-white'
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
    </footer>
  )
}

export default Footer
