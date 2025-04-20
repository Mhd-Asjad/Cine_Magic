import axios from 'axios'

const seatsApi = axios.create({
    baseURL : 'http://127.0.0.1:8000/seats/'
})  

seatsApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('theatre_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`

    }
    return config
    },
    (error) => {
        console.error("Request Interceptor Error:", error);
        return Promise.reject(error);
    }
)



const getRefreshToken = () => localStorage.getItem('refresh_token')
seatsApi.interceptors.response.use(
    response => response,
    async (error) => {
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

export default seatsApi