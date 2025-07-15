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
import { MessageCircle , LayoutDashboard  , Bell ,  LogOut, User , LockKeyhole , Lock , CircleAlert , Menu , X , MapPin , ChevronDown } from 'lucide-react';
import { clearNotifications , setNotifications } from '@/redux/features/notificationSlice';
import { toast } from 'sonner';
import { checkUserBlocked } from '@/pages/userauth/AuthService';
import apiBooking from '@/axios/Bookingapi';
import navlogo  from '../../../src/assets/navlogo.png'
function Nav() {
  const [isModalOpen , setIsModalOpen] = useState(false);
  const [isOtpSent , setIsOtpSent] = useState(false);
  const [ message , setMessage ] = useState('');
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
  const {notifications } = useSelector((state) => state.notifications);
  const openModal = () => setIsModalOpen(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setIsOtpSent(false);
    setMessage('');
  }
  console.log(import.meta.env.VITE_BOOKING_API , 'booking apiii comes from the api file')

  console.log(notifications)

  const fetchNotifications = async () => {
      try {
          
        const res = await apiBooking.get('notifications/');
        console.log(res.data.notifications);
        dispatch(setNotifications(res.data.notifications));

      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
 
  };
  useEffect(() => {
  const checkStatus = async () => {
    console.log(
      'inside check status' , user.id
    )
    if (!user?.id) return;

    try {
      const res = await checkUserBlocked(user.id);
      console.log(res)
      if (res.data?.is_blocked) {
        handleLogout(); 
        toast("Your account has been blocked.", {
          icon: <LockKeyhole />,
        });

      }else if (res.status === 401) {
        
        handleLogout()
        toast('your account is expired or blocked please login',{
          icon: <CircleAlert size={20} />
        });
      } else {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Status Check Error:", error);
    }
  };

  checkStatus();
  }, [user] );


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
    <nav className="bg-white shadow-md relative">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section - Hidden on mobile to save space */}
          <div className="hidden lg:flex items-center justify-start">
            <div className="w-36 h-20 rounded-lg flex items-center justify-center overflow-hidden">
              <img src={navlogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">cineMagic</span>
          </div>


          {/* Desktop Navigation Links */}
          <div className="hidden md:flex flex-1 justify-start lg:px-40 px-8 space-x-6 lg:space-x-10 font-bold">
            <a href="/" className="text-gray-700 hover:bg-blue-100 py-1 px-3 rounded-md transition-colors">
              Home
            </a>
            <a href="/blogs" className="text-gray-700 hover:bg-blue-100 py-1 px-3 rounded-md transition-colors">
              Blogs
            </a>
            <a href="/movies/my-orders" className="text-gray-700 hover:bg-blue-100 py-1 px-3 rounded-md transition-colors">
              Order
            </a>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Select City */}
            <button
              className="flex items-center gap-1 px-2 py-1 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-100 transition text-sm"
              onClick={() => setIsCityModalOpen(true)}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden lg:inline">{selectedcity || 'Location'}</span>
              <span className="lg:hidden">LOC</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => navigate('/notifications')}

            >
              <Bell className="text-gray-700 w-5 h-5" />
              {unread_count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unread_count > 99 ? '99+' : unread_count}
                </span>
              )}
            </button>

            {/* User Auth */}
            {user.username ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-1 rounded-full border border-gray-400 px-3 py-1.5 md:px-2 text-sm font-semibold text-black hover:bg-gray-100 transition"
                >
                  <User className="w-4 h-4" />
                  <span className="truncate max-w-[80px] lg:max-w-[120px]">{user.username}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                    <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      <User className="inline w-4 h-4 mr-2" /> Profile
                    </a>
                    {user.is_approved && (
                      <a href="/theatre-owner/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <LayoutDashboard className="inline w-4 h-4 mr-2" /> Theatre Dashboard
                      </a>
                    )}
                    {user.is_admin && (
                      <a href="/admin/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <LayoutDashboard className="inline w-4 h-4 mr-2" /> Admin Dashboard
                      </a>
                    )}
                    <a href="/complaint/assistant" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      <MessageCircle className="inline w-4 h-4 mr-2" /> Help / Chat
                    </a>
                    <a
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                    >
                      <LogOut className="inline w-4 h-4 mr-2" /> Logout
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openModal}
                className="flex items-center gap-1 border border-gray-800 text-xs px-2 py-1 rounded-md transition duration-300 hover:bg-gray-100"
              >
                Login / Signup <Lock className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <img src={navlogo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="ml-2 text-lg font-bold text-gray-900">cineMagic</span>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-lg z-30">
            <div className="px-4 py-3 space-y-1">
              
              {/* Navigation Links */}
              <div className="border-b border-gray-200 pb-3 mb-3">
                <a href="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium">
                  Home
                </a>
                <a href="/blogs" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium">
                  Blogs
                </a>
                <a href="/movies/my-orders" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium">
                  Order
                </a>
              </div>

              <div className="space-y-2">
                <button
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsCityModalOpen(true)}
                >
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>{selectedcity || 'Select Location'}</span>
                </button>

                <button 
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => navigate('/notifications')}
                >
                  <Bell className="w-4 h-4 mr-3" />
                  <span>Notifications</span>
                  {unread_count > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unread_count > 99 ? '99+' : unread_count}
                    </span>
                  )}
                </button>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3">
                {user.username ? (
                  <div>
                    <div className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-md mb-2">
                      <User className="inline w-4 h-4 mr-2" />
                      {user.username}
                    </div>
                    <div className="space-y-1">
                      <a href="/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        Profile
                      </a>
                      {user.is_approved && (
                        <a href="/theatre-owner/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                          Theatre Dashboard
                        </a>
                      )}
                      {user.is_admin && (
                        <a href="/admin/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                          Admin Dashboard
                        </a>
                      )}
                      <a href="/complaint/assistant" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        Help / Chat
                      </a>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={openModal}
                    className="w-full bg-orange-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Login / Signup
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
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
  );
};

export default Nav;