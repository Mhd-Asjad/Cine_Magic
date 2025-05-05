import userApi from "@/Axios/userApi"
import { useDispatch } from "react-redux"
import { setUsername , setEmail , setUser_id , setPrevilage } from "@/Redux/Features/UserSlice"
import { setTheatreOwner } from '../../Redux/Features/Theatreownerslice';

const TOKEN_KEYS = {
    user: 'user_token',
    admin: 'admin_token',
    theatre: 'theatre_token'
}

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
            dispatch(setUser_id(id))
            dispatch(setUsername(username))
            dispatch(setEmail(email))
            dispatch(setPrevilage({
                is_admin : is_admin,
                is_theatre : is_theatre_owner,
                is_approved : is_approved
                
            }))
            return {
                token : access_token,
            };
        } 
    }catch(error) {
        console.error('Login error:', error);
        throw error
    }
}

export const logout = () => {
    const userType = localStorage.getItem('current_user_type');
    if (userType) {
        localStorage.removeItem(TOKEN_KEYS[userType]);
        localStorage.removeItem(`${TOKEN_KEYS[userType]}_refresh`);
        localStorage.removeItem('current_user_type');
    } else {
        clearAllTokens();
    }
    
    window.dispatchEvent(new Event('storage'));
};


export const clearAllTokens = () => {
    Object.values(TOKEN_KEYS).forEach(value => {

        localStorage.removeItem(value)
        localStorage.removeItem(`${value}_refresh`)
    })
    localStorage.removeItem('current_user_type')
}

export default login