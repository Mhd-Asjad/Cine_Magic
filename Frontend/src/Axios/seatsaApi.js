import axios from 'axios'

const seatsApi = axios.create({
    baseURL : 'http://127.0.0.1:8000/seats/'
})  

seatsApi.interceptors.request.use((config) => {
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
)

const getRefreshToken = () => localStorage.getItem(`${current_user}_token_refresh`)
seatsApi.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response.status === 401) {
            try {
                const refreshResponse = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                    refresh : getRefreshToken()
                });
                console.log(refreshResponse , 'data not refreshing on th seats api')
                localStorage.setItem('theatre_token', refreshResponse.data.access)
                error.config.headers['Autherization'] = `Bearer ${refreshResponse.data.access}`;
                return axios(error.config)

            }catch (refreshError) {
                console.log(refreshError)

                localStorage.removeItem("theatre_token")
                localStorage.removeItem("")
                window.location.href ='/theatre/login'
            }
        }
        return Promise.reject(error)
    }
)
export default seatsApi