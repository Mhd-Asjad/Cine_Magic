import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
    name : 'location' , 
    initialState : {
        cityId : '' ,
        location : '',
        selectedCity : null

    },

    reducers : {

        setLocation : (state , action) => {
            state.cityId = action.payload.cityId;
            state.location = action.payload.location
        },  
        setSelectedCity : (state , action ) => {
            state.selectedCity = action.payload
        },
        clearLocation : (state , action) => {
            state.selectedCity = ''
        }

    }
})
export const selectCityId  = (state) => state.location.cityId;
export const { setLocation , setSelectedCity , clearLocation } = locationSlice.actions;
export default locationSlice.reducer;