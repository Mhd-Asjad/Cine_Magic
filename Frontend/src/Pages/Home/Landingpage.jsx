import React from 'react'
import Nav from '../../Components/Navbar/Nav'
import Upcoming_Carosel from '../../Components/MovieCarousel/Upcoming_Carosel'
import Footer from '../../Components/Footer/footer'
import MovieGrid from '../../Components/MovieCards/MovieList'
import Upcomingmovies from '@/Components/MovieCards/upcomingmovies'

function Landingpage() {


  return (
    <div className='bg-gray-50' >
      <Nav/>
      <Upcoming_Carosel/>
      <MovieGrid/>
      <Footer/>
    </div>
  )
}

export default Landingpage
