import React from 'react'
import Nav from '../../components/Navbar/Nav'
import Upcoming_Carosel from '../../components/MovieCarousel/Upcoming_Carosel'
import Footer from '../../omponents/Footer/footer'
import MovieGrid from '../../components/MovieCards/MovieList'
import ''
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
