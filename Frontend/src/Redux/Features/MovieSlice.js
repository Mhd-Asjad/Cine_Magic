import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({

    name : 'movies' , 
    initialState : {
        movies : [],
    },

    reducers : {
        setMovies : (state , action ) => {
            state.movies = action.payload
        },
        clearMovies : (state) => {
            state.movies = []
        },
    },
});

export const { setMovies , clearMovies } = movieSlice.actions;
export default movieSlice.reducer;