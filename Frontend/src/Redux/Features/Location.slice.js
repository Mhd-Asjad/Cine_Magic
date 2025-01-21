import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
    name : 'location' , 
    initialState : {
        location : '',
        selectedCity : null

    },

    reducers : {

        setLocation : (state , action) => {
            state.location = action.payload
        },
        setSelectedCity : (state , action ) => {
            state.selectedCity = action.payload
        }
    }
})

export const { setLocation , setSelectedCity } = locationSlice.actions;
export default locationSlice.reducer;