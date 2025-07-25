import axios from 'axios'

const API_BASE_URL  = import.meta.env.VITE_THEATER_API
const TheatreApi = axios.create({
    baseURL : API_BASE_URL ,
    headers : {
        "Content-Type": "application/json", 
    }
});

TheatreApi.interceptors.request.use((config) => {
    const current_user = localStorage.getItem('current_user_type')
    const token = localStorage.getItem(`${current_user}_token`)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
    },
    (error) => {
        console.error("Request Interceptor Error:", error);
        return Promise.reject(error);
    }
);

const getRefreshToken = () => localStorage.getItem('refresh_token')
TheatreApi.interceptors.response.use(
    response => response,
    async (error) => {
        console.log(error)
        if (error.response.status === 401) {
            try {
                const refreshResponse = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                    refresh : getRefreshToken()
                });

                localStorage.setItem('theatre_token', refreshResponse.data.access)
                error.config.headers['Autherization'] = `Bearer ${refreshResponse.data.access}`;
                return axios(error.config)

            }catch (refreshError) {
                localStorage.removeItem("theatre_token")
                localStorage.removeItem("")
                window.location.href ='/theatre/login'  
            }   
        }
        return Promise.reject(error)
    }
)

export default TheatreApi