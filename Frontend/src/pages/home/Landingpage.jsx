import React, { useState } from 'react'
import Nav from '../../components/navbar/Nav'
import Upcoming_Carosel from '../../components/moviecarousel/Upcoming_Carosel'
import Footer from '../../components/footer/Footer'
import MovieGrid from '../../components/moviecards/MovieList'
import Player from '@/components/vedioplayer/Player'
function Landingpage() {
  const [selectedVideoId  , setSelectedVideoId ] = useState(null);
  const [showModal , setModal ] = useState(false);

  const handleClick = (vedioId) => {
    setSelectedVideoId(vedioId)
    setModal(true)
  }

  const closeModal = () => {
    setModal(false);
    setSelectedVideoId(null);
  };

  return (
    <div className='bg-gray-50' >
      <Nav />
      <Upcoming_Carosel handleCardClick={handleClick} />
      <MovieGrid />
      <Footer />

      { showModal && selectedVideoId &&

        <Player videoId={selectedVideoId} closeModal={closeModal} />
      }
    </div>
  )
}

export default Landingpage
