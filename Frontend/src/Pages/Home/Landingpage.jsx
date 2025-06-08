import React from 'react'
import Nav from '../../components/navbar/Nav'
import Upcoming_Carosel from '../../components/moviecarousel/Upcoming_Carosel'
import Footer from '../../components/footer/Footer'
import MovieGrid from '../../components/moviecards/MovieList'
function Landingpage() {


  return (
    <div className='bg-gray-50' >
      <Nav />
      <Upcoming_Carosel />
      <MovieGrid />
      <Footer />
    </div>
  )
}

export default Landingpage
