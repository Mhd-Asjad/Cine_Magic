import React from 'react'
import Nav from '../../Components/Navbar/Nav'
import Upcoming_Carosel from '../../Components/MovieCarousel/Upcoming_Carosel'
import Footer from '../../Components/Footer/footer'
import MovieGrid from '../../Components/MovieCards/MovieList'

function Landingpage() {


  return (
    <div>
      <Nav/>
      <Upcoming_Carosel/>
      <MovieGrid/>
      <Footer/>
    </div>
  )
}

export default Landingpage
