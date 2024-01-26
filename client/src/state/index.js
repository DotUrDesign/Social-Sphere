import { createSlice} from "@reduxjs/toolkit";

// This essentially will be the state that will be stored in our Global state so this data will be accessible throughout our entire application and we can grab it anywhere we want.
const initialState = {
    mode: "light", // this represents the light mode and dark mode.

    // this is all the auth information we gonna store.
    user: null, 
    token: null, 
    posts: [],
};

export const authSlice = createSlice({
    name: "auth",  // auth workflow
    initialState,  // described above...

    // you can think the reducers as functions that involve modifying the global state. That's the only difference between the reducers and regular functions.
    reducers : {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) => {
            if(state.user) {
                state.user.friends = action.payload.friends;
            } else {
                console.error("user friends non-existent :(");
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if(post._id === action.payload.post._id)
                    return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        }
    }
})

export const {setMode, setLogin, setLogout, setFriends, setPosts, setPost} = authSlice.actions;
export default authSlice.reducer;