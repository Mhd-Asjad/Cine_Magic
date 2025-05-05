import { createSlice , nanoid } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
const initialState = {
    posts : [],
    status : 'idle',
    error : null,
    currentPostId : null
}

const Blogslice = createSlice({
    name : 'posts',
    initialState ,
    reducers : {

        postAdded : {
            reducer(state , action) {

                state.posts.push(action.payload)
            },
            prepare(title , description , image ){
                return {
                    payload :{
                        id : nanoid(),
                        title ,
                        description ,
                        image ,
                        date : new Date().toISOString(),
                        author : {
                            id : user.id ,
                            name : user.username
                        },
                        reactions : {
                            likes : 0,
                            loves : 0,
                            wows : 0
                        }
                    }
                }
            }
        },

        postUpdated : (state , action) => {
            const { id , title , description , image } = action.payload;
            const existingPost = state.posts.find( post => post.id === id)

            if (existingPost) {
                existingPost.title = title;
                existingPost.description = description;
        
                if (image) {
                    existingPost.image = image;
        
                };
            }
            existingPost.lastUpdated = new Date().toISOString();
        },
        postDeleted : (state , action ) => {
            const postId = action.payload
            state.posts = state.posts.filter( post => post.id !== postId)

            if (state.currentPostId === postId) {
                state.currentPostId = null;
            }
        },
        reactionAdded : function(state , action){
            const {postId , reactionType } = action.payload
            const existingPost = state.posts.find( post => post.id === postId)

            if (existingPost) {
                existingPost.reaction[reactionType]++;

            }
        },
        setCurrentPost : (state , action ) => {
            state.currentPostId = action.payload 
        },
        resetCurrentPost : (state , action) => {
            state.currentPostId = null;
        }
    },

})

export const {
    postAdded ,
    postUpdated,

} = Blogslice.actions;

export const selectAllPosts = state => state.posts.posts
export default Blogslice.reducer;