import axios from 'axios'

const apiBlogs = axios.create({
    baseURL : 'http://127.0.0.1:8000/blog/',
})

export default apiBlogs