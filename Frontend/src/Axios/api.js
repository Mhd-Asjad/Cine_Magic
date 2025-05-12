import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const apiAdmin = axios.create({
    baseURL : 'http://127.0.0.1:8000/adminside/'
});

apiAdmin.interceptors.request.use((config) => {
    const current_user = localStorage.getItem('current_user_type')
    const token = localStorage.getItem(`${current_user}_token`)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

apiAdmin.interceptors.response.use(

    (response) => response , 
    async(error) => {
        const navigate = useNavigate();

        if (error.response.status == 400 ) {
            const refreshToken = localStorage.getItem("refresh_token");

        }
    }
)
export default apiAdmin