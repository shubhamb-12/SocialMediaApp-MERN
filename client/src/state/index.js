import { createSlice } from "@reduxjs/toolkit";

// This is the state that would be stored in our Global state. This data will be accesible throughout our entire application. We dont have to pass in state and properties down to different components.
const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  // reducers are our actions can consider them as functions that are involve in modifying the global state
  reducers: {
    // To switch between light mode & dark mode
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },

    setLogin: (state, action) => {
      // action => payload OR (params or arguments) for the function
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },

    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends not exists :(");
      }
    },

    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },

    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post_id) return action.payload.post;
        return post; // else returning the current post
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;
