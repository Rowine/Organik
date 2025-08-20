
import Hero from '../components/Hero'
import CategoryPreview from '../components/CategoryPreview'
import Meta from '../components/Meta'

const Home = () => {
  return (
    <>
      <Meta title='Organik | Home' />
      <main>
        <Hero />
        <CategoryPreview />
      </main>
    </>
  )
}

export default Home
