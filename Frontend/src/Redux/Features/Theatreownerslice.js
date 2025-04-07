import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    owner_id : '',
    isTheatreOwner : false ,
    theatreId : null ,
    theatreName : '',
    location : '' ,
    state : '' ,
    pincode : '',
    ownership_status : 'pending',

}

const theatreOwnerSlice = createSlice({
    name : 'theatreOwner',
    initialState ,
    reducers : {
        setTheatreOwner : (state  , action) => {
            state.owner_id = action.payload.owner_id
            state.isTheatreOwner = true;
            state.theatreId = action.payload.theatreId ;
            state.theatreName = action.payload.theatreName ;
            state.location = action.payload.location ;
            state.state = action.payload.state ;
            state.pincode = action.payload.pincode ;
            
        },
        updateOwnershipStatus : (state , action) => {
            state.ownership_status = action.payload;
            
        },
        clearTheatreOwner: (state) => {
            state.isTheatreOwner = false;
            state.theatreId = null;
            state.theatreName = "";
            state.location = "";
            state.state = "";
            state.pincode = "";
            state.ownership_status = "pending";
        }
    }
})

export const { setTheatreOwner , updateOwnershipStatus , clearTheatreOwner } = theatreOwnerSlice.actions
export default theatreOwnerSlice.reducer;