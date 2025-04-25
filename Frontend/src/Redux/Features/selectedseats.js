import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedSeats : [],
    showId : null,
    lockExpiry: null,
    isLocked : true
}

const seatSelectionSlice  = createSlice({
    name : 'seatselection',
    initialState,
    reducers : {
        lockseats(state , action) {
            console.log(action.payload , 'payloaad data')
            
            state.selectedSeats = action.payload.seatIds
            state.showId = action.payload.showId
            state.lockExpiry = action.payload.expiresAt
            state.isLocked = true
        },
        clearSelection(state) {
            state.selectedSeats = null
            state.showId = ''
            state.lockExpiry = null
            state.isLocked = false
        }
    }


});

export const { lockseats , clearSelection } = seatSelectionSlice.actions;
export default seatSelectionSlice.reducer;