import React from 'react'
import Nav from '../../Components/Navbar/Nav'
import background from '../../assets/profilebg.jpg'
// import userlogo from '../../assets/userlogo.png'

function Profile() {
  return (
    <div >
      <Nav/>
      <div className='flex contianer relative'>

        <img className='w-full h-[00px]' src={background} alt="" />
    
        <div className='absolute'>

          <img className='w-[35%] h-[30%]' src={userlogo} alt="" />

        </div>
      </div>


    </div>
  )
}

export default Profile