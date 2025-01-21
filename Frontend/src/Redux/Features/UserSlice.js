import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
    name : 'user' , 
    initialState : {
        username : '' ,
        email : '' ,
    },
    reducers : {
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


export const { setUsername , setEmail , resetUser} = UserSlice.actions
export default UserSlice.reducer;