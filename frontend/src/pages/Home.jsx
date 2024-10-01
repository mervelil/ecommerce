
import Hero from '../components/Hero'
import NewsLetter from '../components/NewsLetter'
import NewCollection from '../components/NewCollections'
import Offer from '../components/Offer'
import Popular from '../components/Popular'

const Home = () => {
  return (
    <>
      <Hero/>
      <Popular/>
      <Offer/>
      <NewCollection/>
      <NewsLetter/>
    </>
  )
}

export default Home

