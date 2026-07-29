import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  platforms: [
    "Instagram",
    "Facebook",
    "Twitter (X)",
    "LinkedIn",
    "YouTube",
  ],
};

const platformSlice = createSlice({
  name: "platforms",

  initialState,

  reducers: {},
});

export default platformSlice.reducer;