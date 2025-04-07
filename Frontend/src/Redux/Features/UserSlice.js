import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
    name : 'user' , 
    initialState : {
        id : 0,
        username : '' ,
        email : '' ,
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
        resetUser : (state) => {
            state.username = ''
            state.email = ''
        }   
    }
})


export const { setUser_id , setUsername , setEmail , resetUser} = UserSlice.actions
export default UserSlice.reducer;