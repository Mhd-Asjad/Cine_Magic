import axios from 'axios'

const apiMovies = axios.create({
    baseURL : import.meta.env.VITE_MOVIE_API,
})

apiMovies.interceptors.request.use((config) => {
    const current_user = localStorage.getItem('current_user_type')
    const token = localStorage.getItem(`${current_user}_token`)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default apiMovies