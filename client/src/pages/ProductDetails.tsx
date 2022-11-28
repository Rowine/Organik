import React from 'react'
import { Link, useMatch } from 'react-router-dom'
import Container from '../components/Container'
import Rating from '../components/Rating'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as HeartFull } from '@fortawesome/free-solid-svg-icons'
import { faHeart as HeartEmpty } from '@fortawesome/free-regular-svg-icons'
import IProductItem from '../interfaces/IProductItem'
// @ts-ignore
import products from '../products'

const ProductDetails = () => {
  const match = useMatch('/:category/:id')
  const product =
    match !== null &&
    products.find(
      (product: IProductItem) => product.id.toString() === match.params.id
    )

  return (
    <Container>
      <div className='py-16 sm:py-24'>
        <Link to={`/${product.category}`}>
          <button className='bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded uppercase'>
            Back to {product.category}
          </button>
        </Link>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-2'>
          <div className='col-span-2'>
            <div className='aspect-w-3 aspect-h-2 overflow-hidden rounded-lg lg:block'>
              <img
                src={product.imageSrc}
                alt={product.imageAlt}
                className='h-full w-full object-contain object-center'
              />
            </div>
          </div>
          <div className='flex flex-col space-y-5 mt-5'>
            <Rating value={product.rating} />
            <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
              {product.name}
            </h1>
            <p className='text-gray-500 text-lg font-bold'>₱{product.price}</p>
            <p className='text-gray-500'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consectetur sequi ut at dolores autem, corporis voluptate veniam
              quia qui non adipisci fugiat repellendus exercitationem ullam
              praesentium. In aliquam harum facere?
            </p>
            <p className='text-gray-500'>
              In Stock:{' '}
              <span className='font-bold'>{product.countInStock}</span>
            </p>
            <div className='grid grid-cols-4 gap-x-1'>
              <button
                className={
                  product.countInStock === 0
                    ? 'bg-gray-500 text-white font-bold py-2 px-4 rounded col-span-3'
                    : 'bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded col-span-3'
                }
                disabled={product.countInStock === 0}
              >
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                className={
                  product.countInStock === 0
                    ? 'bg-gray-500 text-white font-bold py-2 px-4 rounded w-full'
                    : 'bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded '
                }
                disabled={product.countInStock === 0}
              >
                <FontAwesomeIcon icon={HeartEmpty} className='h-5 w-5' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ProductDetails