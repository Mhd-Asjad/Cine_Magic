import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
    name : 'user' , 
    initialState : {
        id : null,
        username : '' ,
        email : '' ,
        is_theatre_owner : false,
        is_approved : false,    
        is_admin : false
    },
    reducers : {
        setUser_id : (state , action ) => {
            state.id = action.payload
        },
        setUsername : (state , action ) => {
            state.username = action.payload;

        },
        setEmail : (state , action ) => {
            state.email = action.payload
        },
        setPrevilage : (state , action) => {
            state.is_approved = action.payload.is_approved
            state.is_theatre_owner = action.payload.is_theatre
            state.is_admin = action.payload.is_admin
        },
        resetUser : (state) => {
            state.id = null,
            state.username = ''
            state.email = ''
        }   
    }
})


export const { setUser_id , setUsername , setEmail , setPrevilage ,  resetUser} = UserSlice.actions
export default UserSlice.reducer;