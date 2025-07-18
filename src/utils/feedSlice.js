import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    addFeed: (state, action) =>
      Array.isArray(action.payload)
        ? action.payload
        : action.payload?.data || [],
    removeUserFromFeed: (state, action) => {
      const newFeed = state.filter((card) => card._id !== action.payload);
      return newFeed;
    },
  },
});

export const { addFeed, removeUserFromFeed } = feedSlice.actions;

export default feedSlice.reducer;
