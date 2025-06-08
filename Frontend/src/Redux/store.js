import { combineReducers, configureStore } from '@reduxjs/toolkit';
import movieReducer from './features/MovieSlice'
import LocationReducer from './features/Location.slice'
import userReducer from './features/UserSlice'
import theatreOwnerReducer from './features/Theatreownerslice'
import selectedSeatsReducer from './features/selectedseats'
import BlogPostsReducer from './features/BlogSlice'
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