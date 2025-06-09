import axios from 'axios'
import { config } from 'dotenv'

const apiReview = axios.create({
    baseURL : import.meta.env.VITE_REVIEW_API
})

apiReview.interceptors.request.use((config) => {
    const current_user = localStorage.getItem('current_user_type')
    const token = localStorage.getItem(`${current_user}_token`)

    if (token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default apiReview