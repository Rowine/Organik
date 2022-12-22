import React from 'react'
import Hero from '../components/Hero'
import CategoryPreview from '../components/CategoryPreview'
import Container from '../components/Container'
import Meta from '../components/Meta'

const Home = () => {
  return (
    <>
      <Meta title='Organik | Home' />
      <Container>
        <Hero />
        <CategoryPreview />
      </Container>
    </>
  )
}

export default Home
