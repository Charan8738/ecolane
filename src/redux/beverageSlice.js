import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";

const initialState = {
  beverages: [],
  status: "idle", // 'idle' | 'loading'  | 'succeeded | 'failed'
  error: null,
};

export const fetchClients = createAsyncThunk("getBeverages", async (client_id) => {
  try {
    // const axiosInstanceRemote = axios.create();
    // const response = await axiosInstanceRemote.get(
    //   "https://zig-web.com/Zigsmartv3ios/api/Beverage/GetAllBeverageData?Status=1&Clientid=" + client_id
    // );
    const response = await axios.get(
      "getBeverages?client_id=" + client_id
    );
    // console.log(response.data);
    return [...response.data];
  } catch (err) {
    return err.message;
  }
});
export const beverageSlice = createSlice({
  name: "beverage",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchClients.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.beverages = [...action.payload];
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const selectAllClients = (state) => state.beverage.beverages;
export const getClientsStatus = (state) => state.beverage.status;
export const getClientsError = (state) => state.beverage.error;
// Action creators are generated for each case reducer function
// export const { setItems } = clientSlice.actions;

export default beverageSlice.reducer;
