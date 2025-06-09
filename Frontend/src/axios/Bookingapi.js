import axios from 'axios'

const apiBooking = axios.create({
    baseURL : import.meta.env.VITE_BOOKING_API,
})

apiBooking.interceptors.request.use((config) => {
    const current_user = localStorage.getItem('current_user_type')
    const token = localStorage.getItem(`${current_user}_token`)
    
    if (token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
export default apiBooking