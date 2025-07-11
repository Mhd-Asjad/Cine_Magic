import userApi from "@/axios/userApi"
import { setUsername , setEmail , setUser_id , setPrevilage } from "@/redux/features/UserSlice"
import { setTheatreOwner } from '../../redux/features/Theatreownerslice';
import {jwtDecode} from 'jwt-decode';

const TOKEN_KEYS = {
    user: 'user_token',
    admin: 'admin_token',
    theatre: 'theatre_token'
}
const SESSION_ID = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
sessionStorage.setItem('auth_session_id', SESSION_ID);

if (!sessionStorage.getItem('auth_session_id')) {
  sessionStorage.setItem(
    'auth_session_id',
    `${Date.now()}_${Math.random().toString(36).substring(2)}`
  );
}

window.addEventListener('storage', (event) => {
  if (event.key === 'auth_event_source') {
    const sourceTab = event.newValue;
    const currentTab = sessionStorage.getItem('auth_session_id');

    if (sourceTab !== currentTab) {

        window.location.reload();
        
    }
  }
});

export const checkUserBlocked = async (userId) => {
    try {
     const res = await userApi.get(`auth/status/${userId}/`);
     return res
    } catch (err) {
     console.error("Status check failed:", err);
     return err
    }
};


export const login  = async ( dispatch ,  username , password , loginType ) => {
    
    try {
        clearAllTokens()
        const res  = await userApi.post('userlogin/', {
            'username' : username,
            'password' : password ,
            'user_type' : loginType
        },
        { headers: { 'Content-Type': 'application/json' },})
        console.log(res.data.user)
        const tokenKey = TOKEN_KEYS[loginType]
        if (res.status == 200 ){
            const { refresh_token , access_token , id ,  username , email , is_admin  , is_theatre_owner , is_approved , theatre_profile  } = res.data.user
            localStorage.setItem('auth_event_source', sessionStorage.getItem('auth_session_id'));
            localStorage.setItem(tokenKey , access_token )
            localStorage.setItem(`${tokenKey}_refresh`,refresh_token)
            localStorage.setItem('current_user_type' , loginType)

            if (theatre_profile) {
                dispatch(setTheatreOwner({
                  owner_id : theatre_profile.user,    
                  theatreId : theatre_profile.id,
                  theatreName : theatre_profile.theatre_name,
                  location : theatre_profile.location,
                  state : theatre_profile.state ,
                  pincode : theatre_profile.pincode ,
                  ownership_status : 'confirmed' ,
                }));
            }
            console.log(is_theatre_owner , is_admin,is_approved , 'from login')
            dispatch(setUser_id(id))
            dispatch(setUsername(username))
            dispatch(setEmail(email))
            dispatch(setPrevilage({
                is_admin : is_admin,
                is_theatre : is_theatre_owner,
                is_approved : is_approved
                
            }))

            window.dispatchEvent(new Event('autoChange'))
            return {
                token : access_token,
            };
        } 
    }catch(error) {
        console.error('Login error:', error);
        throw error
    }
    
}

export const logout = async() => {
    console.log('entering to the logout function')
    const userType = localStorage.getItem('current_user_type');
    const refreshToken = localStorage.getItem(`${TOKEN_KEYS[userType]}_refresh`);
    localStorage.setItem('auth_event_source', sessionStorage.getItem('auth_session_id'));

    try {
        const res = await userApi.post('userlogout/',{
            'refresh' : refreshToken
        })
        console.log(res.data)
    }catch(e){
        console.log('error on logout',e.response?.data || 'error occurs' )
    }
    if (userType) {
        localStorage.removeItem(TOKEN_KEYS[userType]);
        localStorage.removeItem(`${TOKEN_KEYS[userType]}_refresh`);
        localStorage.removeItem('current_user_type');
    } else {
        clearAllTokens();
    }
    
    window.dispatchEvent(new Event('autoChange'));
};


export const getCurrentUser = () => {
    const userType = localStorage.getItem('current_user_type')
    if (!userType) return null

    const token= localStorage.getItem(TOKEN_KEYS[userType])
    if (!token) return null

    try {
        const decodedToken = jwtDecode(token);


        const current_time = Date.now() / 1000 
        if (decodedToken.exp < current_time + 30) {
            logout()
            return null
        }
        return {
            ...decodedToken , 
            userType
        }
    }catch(error) {
        console.log(error , 'Token Decode error')
        logout()
        return null
    }
}

export const clearAllTokens = () => {
    Object.values(TOKEN_KEYS).forEach(value => {

        localStorage.removeItem(value)
        localStorage.removeItem(`${value}_refresh`)
    })
    localStorage.removeItem('current_user_type')

}

export default login