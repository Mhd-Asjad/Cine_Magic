import axios from 'axios'

const userApi = axios.create({
    baseURL : 'http://127.0.0.1:8000/user_api/'
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