import React , {useEffect, useState, useRef} from 'react'
import Modal from '../modals/Modal';
import OtpVerificationForm from '../../pages/userauth/OtpVerificationForm';
import { MdOutlineAddLocation } from "react-icons/md";
import Cityselction from '../../pages/home/Cityselction';
import { useDispatch , useSelector } from 'react-redux';
import { setMovies } from '../../redux/features/MovieSlice';
import { setLocation, setSelectedCity , clearLocation } from '../../redux/features/Location.slice';
import { HiUser } from "react-icons/hi2";
import { IoMdArrowDropdown } from "react-icons/io";
import { resetUser } from '../../redux/features/UserSlice';
import AuthContainer from '../../pages/userauth/AuthContainer';
import { useNavigate } from 'react-router-dom';
import { selectCityId } from '../../redux/features/Location.slice';
import { logout } from '@/pages/userauth/AuthService';
import apiMovies from '@/axios/Moviesapi';
import { MessageCircle , LayoutDashboard  , Bell ,  LogOut, User } from 'lucide-react';
import { clearNotifications } from '@/redux/features/notificationSlice';
function Nav() {
  const [isModalOpen , setIsModalOpen] = useState(false);
  const [message , setMessage] = useState('');
  const [isOtpSent , setIsOtpSent] = useState(false);
  const [userEmail , setUserEmail ] = useState('');
  const dispatch = useDispatch();
  const selectedcity = useSelector((state) => state.location.selectedCity);
  const cityid = useSelector(selectCityId);
  const user = useSelector((state) => state.user);
  const [ isCityModalOpen , setIsCityModalOpen] = useState(false);
  const [dropdownOpen , setDropdownOpen ] = useState(false);
  const  navigate = useNavigate();
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)
  const { unread_count } = useSelector((state) => state.notifications.counts);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsOtpSent(false);
    setMessage('');
  }

  const handleCitySelect = async ( cityId , currentCity  ) => {
    // here fetching the city id to show city based movie
    // cityId comes cityselection component
    setIsCityModalOpen(false)
    if (!cityId){
      return;
    }
    console.log(cityId ,'id from location' , 'id from redux:' , cityid)
    console.log(cityId, ' <-- cityId selected by user');

    try {
      const response = await apiMovies.get(`/get-multiplecity-movies/?city_ids=${cityId}`)
      console.log(response.data , 'city based movies')
      const [{ city_id , location , movies}] = response.data;

      if (response.data.length > 1){
        const allMovies = res.data.flatMap(city => city.movies);
        const uniqueMovies =Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());
        dispatch(setMovies(uniqueMovies))

      }else {
        dispatch(setMovies(movies))
        
      }

      if (movies.length > 0) {

        dispatch(setLocation({
          cityId : city_id,
          location : currentCity ? currentCity : location
        }))
        dispatch(setSelectedCity(currentCity ? currentCity : location))

      }else{
        console.log('inside else block in Nav ')
        dispatch(clearLocation())
      }
      console.log(selectedcity , 'user clicked city')

      
    }catch(error){
      console.log(error.response)
      console.log('failed to fetch movie related city'); 
    }
  } 



  window.addEventListener('storage', (event) => {
      if (event.key === 'current_user_type') {
          window.location.reload();
      }
  });

  const handleLogout = () => {
    dispatch(resetUser())
    dispatch(clearNotifications())
    logout()
    toggleDropdown()
    navigate('/')
  }

  return (

    <nav className="bg-white-800 shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between h-16">
          <div classNam="flex items-center justify-start px-4">
            {/* <img src={logo} className='h-[160px] rounded-lg ' ></img> */}
          </div>

          <div className="hidden md:flex flex-1 justify-start px-40 space-x-10 font-bold">
            <a href="/" className="text-black-300 hover:bg-blue-200 py-1 px-1 rounded-md">
              Home
            </a>
            <a href="#" className="text-black-300  hover:bg-blue-200 py-1 px-1 rounded-md">
              Theatres
            </a>
            <a href="/blogs" className="text-black-300 hover:bg-blue-200 py-1 px-1 rounded-md ">
              Blogs
            </a>
            <a href="/movies/my-orders" className="text-black-300 hover:bg-blue-200 py-1 px-1 rounded-md">
              Order
            </a>
          </div>

          <div className='flex gap-6' >

          <button
              className="flex p-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-100 focus:ring-gray-300 transition"

              onClick={() => setIsCityModalOpen(true)}
            >

              <MdOutlineAddLocation className="text-2xl" />
              <span className="text-base font-medium">
                  {selectedcity || 'Select Location'}
              </span>
            </button>

              <div>
  
  
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="text-gray-700" size={30} />
              {unread_count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unread_count > 99 ? '99+' : unread_count}
                </span>
              )}
            </button>
              </div>
          { user.username ? (

          <div className='reletive' >

            <button 
            onClick={toggleDropdown}
            className='flex items-center text-xl bg-blue-200  text-black font-semibold px-5 w-full py-2 rounded-lg transition duration-300' > 
            
              <HiUser className='text-2xl text-black' />
               {user.username}

               <IoMdArrowDropdown className='text-xl text-black gap-3 mx-auto' />

              
            </button>

              {dropdownOpen && (
   
                <div className="absolute mx-auto mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <User className='inline'/> profile
                  </a>

                  {user.is_approved && (
                    <a
                    href="/theatre-owner/dashboard"
                    className="block px-4 py-2 text-gray-800  hover:bg-gray-100">
                    <LayoutDashboard className='inline' /> theatre Profile
                    </a>
                  )}

                  {user.is_admin &&(
                     <a
                     href="/admin/dashboard"
                     className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                     <LayoutDashboard className='inline'/> admin dashboard
                   </a>
                  )}

                  <a

                    href="/complaint/assistant"
                    className="block px-4 py-2  text-gray-800 hover:bg-gray-100"
                  >
                    <MessageCircle className='inline'/> Help or Chat
                  </a>



                  <a
                    onClick={handleLogout}
                    className="block px-4 py-2 cursor-pointer text-gray-800 hover:bg-gray-100">
                   <LogOut className='inline'/> Logout

                  </a>
                </div>
              )}

            </div>



          ):(

            <button
            onClick={openModal}
            className="bg-orange-500 text-white font-medium px-4 py-2 rounded-lg transition duration-300"
          >
            Login/Signup
          </button>

          )}

          </div>

          <div className="md:hidden">
            <button
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isCityModalOpen} closeModal={() => setIsCityModalOpen(false)} >
        <Cityselction oncityselect={handleCitySelect} />
      </Modal>
      
      <Modal isOpen={isModalOpen} closeModal={closeModal}>

        {!isOtpSent ? (
        <AuthContainer setIsOtpSent={setIsOtpSent} setUserEmail={setUserEmail} isModalClose={closeModal}/>
          
        ) : (
          <OtpVerificationForm email={userEmail} setMessage={setMessage} closeModal={closeModal}  />
        )}
      </Modal>

    </nav>
  )
}
export default Nav
