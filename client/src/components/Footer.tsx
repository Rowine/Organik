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
    <footer className='w-full bg-green-600 text-white'>
      <Container>
        <div className='mx-auto max-w-7xl py-8 sm:py-12 lg:py-16'>
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
            {/* Brand Section */}
            <div className='text-center sm:text-left'>
              <h2 className='text-2xl font-bold mb-3 sm:mb-4'>ORGANIK</h2>
              <p className='text-white/90 mb-4 sm:mb-6 text-sm sm:text-base'>
                Your trusted source for fresh, organic produce delivered straight to your doorstep.
              </p>
              <div className='flex justify-center sm:justify-start space-x-6 sm:space-x-4'>
                <a href='#' className='text-white hover:text-white/80 p-2 sm:p-0'>
                  <FontAwesomeIcon icon={faFacebook} className='h-7 w-7 sm:h-6 sm:w-6' />
                </a>
                <a href='#' className='text-white hover:text-white/80 p-2 sm:p-0'>
                  <FontAwesomeIcon icon={faInstagram} className='h-7 w-7 sm:h-6 sm:w-6' />
                </a>
                <a href='#' className='text-white hover:text-white/80 p-2 sm:p-0'>
                  <FontAwesomeIcon icon={faTwitter} className='h-7 w-7 sm:h-6 sm:w-6' />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className='text-center sm:text-left'>
              <h3 className='text-lg font-semibold mb-3 sm:mb-4'>Quick Links</h3>
              <ul className='space-y-2 sm:space-y-3 text-sm sm:text-base'>
                <li><a href='#' className='text-white/90 hover:text-white inline-block py-1 sm:py-0'>About Us</a></li>
                <li><a href='#' className='text-white/90 hover:text-white inline-block py-1 sm:py-0'>Our Products</a></li>
                <li><a href='#' className='text-white/90 hover:text-white inline-block py-1 sm:py-0'>Delivery Info</a></li>
                <li><a href='#' className='text-white/90 hover:text-white inline-block py-1 sm:py-0'>Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className='text-center sm:text-left'>
              <h3 className='text-lg font-semibold mb-3 sm:mb-4'>Contact Us</h3>
              <div className='space-y-2 sm:space-y-3 text-white/90 text-sm sm:text-base'>
                <p className='flex items-center justify-center sm:justify-start'>
                  <FontAwesomeIcon icon={faPhone} className='h-5 w-5 mr-2' />
                  +1 302-918-2132
                </p>
                <p>hello@organik.com</p>
              </div>
            </div>

            {/* Newsletter */}
            <div className='text-center sm:text-left'>
              <h3 className='text-lg font-semibold mb-3 sm:mb-4'>Newsletter</h3>
              <p className='text-white/90 mb-3 sm:mb-4 text-sm sm:text-base'>
                Get updates on fresh products and offers.
              </p>
              <form className='flex flex-col space-y-2 sm:space-y-3 max-w-xs mx-auto sm:mx-0'>
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='w-full px-4 py-2 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base'
                />
                <button
                  type='submit'
                  className='w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition-colors text-sm sm:text-base font-medium'
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-white/20 text-center text-white/90 text-sm'>
            <p>© 2020 ORGANIK. All rights reserved.</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
