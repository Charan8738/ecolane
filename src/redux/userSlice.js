import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  username: null,
  user_id: null,
  role: null,
  pages: [],
  acc_status: false,
  homepage: null,
  status: "idle",
};

export const fetchUserDetails = createAsyncThunk("getUserDetails", async () => {
  const response = await axios.get("getClientAcessDetails");
  if (response.data.username != null) {
    return { ...response.data };
  } else {
    throw new Error();
  }
});
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.user_id = action.payload.user_id;
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.pages = action.payload.pages;
      state.acc_status = action.payload.status;
      state.homepage = action.payload.Homepage;
      state.status = "succeeded";
    });
    builder.addCase(fetchUserDetails.pending, (state, action) => {
      state.status = "pending";
    });
    builder.addCase(fetchUserDetails.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});
export const userAuthStatus = (state) => state.user.status;
export const userPages = (state) => [...state.user.pages, 18];
export const role = (state) => state.user.role;
export const user_id = (state) => state.user.user_id;
export const username = (state) => state.user.username;
export const acc_status = (state) => state.user.acc_status;
export const selectHomepage = (state) => state.user.homepage;
export default userSlice.reducer;
