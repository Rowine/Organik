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
        <div className='mx-auto max-w-7xl py-16'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {/* Brand Section */}
            <div>
              <h2 className='text-2xl font-bold mb-4'>ORGANIK</h2>
              <p className='text-white/90 mb-6'>
                Your trusted source for fresh, organic produce delivered straight to your doorstep.
              </p>
              <div className='flex space-x-4'>
                <a href='#' className='text-white hover:text-white/80'>
                  <FontAwesomeIcon icon={faFacebook} className='h-6 w-6' />
                </a>
                <a href='#' className='text-white hover:text-white/80'>
                  <FontAwesomeIcon icon={faInstagram} className='h-6 w-6' />
                </a>
                <a href='#' className='text-white hover:text-white/80'>
                  <FontAwesomeIcon icon={faTwitter} className='h-6 w-6' />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
              <ul className='space-y-3'>
                <li><a href='#' className='text-white/90 hover:text-white'>About Us</a></li>
                <li><a href='#' className='text-white/90 hover:text-white'>Our Products</a></li>
                <li><a href='#' className='text-white/90 hover:text-white'>Delivery Info</a></li>
                <li><a href='#' className='text-white/90 hover:text-white'>Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className='text-lg font-semibold mb-4'>Contact Us</h3>
              <div className='space-y-3 text-white/90'>
                <p className='flex items-center'>
                  <FontAwesomeIcon icon={faPhone} className='h-5 w-5 mr-2' />
                  +1 302-918-2132
                </p>
                <p>hello@organik.com</p>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className='text-lg font-semibold mb-4'>Subscribe to our Newsletter</h3>
              <p className='text-white/90 mb-4'>
                Get the latest updates on fresh products and special offers.
              </p>
              <form className='space-y-3'>
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='w-full px-4 py-2 rounded-md bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500'
                />
                <button
                  type='submit'
                  className='w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition-colors'
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='mt-16 pt-8 border-t border-white/20 text-center text-white/90'>
            <p>© 2020 ORGANIK. All rights reserved.</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
