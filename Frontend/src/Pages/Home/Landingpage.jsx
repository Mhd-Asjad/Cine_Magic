import React from 'react'
import Nav from '../../components/Navbar/Nav'
import Upcoming_Carosel from '../../components/MovieCarousel/Upcoming_Carosel'
import Footer from '../../components/Footer/Footer'
import MovieGrid from '../../components/MovieCards/MovieList'
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
