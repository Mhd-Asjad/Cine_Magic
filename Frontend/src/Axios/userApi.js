import axios from 'axios'

const userApi = axios.create({
    baseURL : import.meta.env.VITE_USER_API,
})

userApi.interceptors.request.use((config) => {
    const current_user = localStorage.getItem('current_user_type')
    const token = localStorage.getItem(`${current_user}_token`)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
export default userApi