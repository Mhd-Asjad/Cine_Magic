import { combineReducers, configureStore } from '@reduxjs/toolkit';
import movieReducer from '../Redux/Features/MovieSlice'
import LocationReducer from '../Redux/Features/Location.slice'
import userReducer from '../Redux/Features/UserSlice'
import theatreOwnerReducer from '../Redux/Features/Theatreownerslice'
import selectedSeatsReducer from '../Redux/Features/selectedseats'
import BlogPostsReducer from '../Redux/Features/BlogSlice'
import {persistStore , persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';

const persistCofig = {

    key : 'root' ,
    storage , 
    whitelist : ['location' , 'movie' , 'user' , 'theatreOwner' , 'selectedSeats']
}   

const rootReducer = combineReducers({
    movie : movieReducer,
    location : LocationReducer,
    user : userReducer,
    theatreOwner : theatreOwnerReducer ,
    selectedSeats : selectedSeatsReducer,
    blogPosts : BlogPostsReducer

})
const persistedReducer = persistReducer(persistCofig , rootReducer)

const store = configureStore({
    reducer : persistedReducer
});

const persistor = persistStore(store);

export { store , persistor };