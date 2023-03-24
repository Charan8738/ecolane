import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  apiCount: 0,
  trips: [],
  status: "idle", // 'idle' | 'loading'  | 'succeeded | 'failed'
  error: null,
};
export const fetchTrips = createAsyncThunk("getTrips", async (data) => {
  const { startDate, endDate, client_id } = data;

  // console.log(user_id);
  // const axiosInstanceRemote = axios.create();
  const response = await axios.get(`AllTripdata?WifiMacAddress=100`);

  return [...response.data];
  console.log("test");
  console.log(response);
});
export const tripsSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTrips.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.apiCount = state.apiCount + 1;
        state.tickets = [...action.payload];
        state.error = null;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const selectAPICount = (state) => state.trip.apiCount;
export const selectAllTrips = (state) => state.trip.trips;
export const getTripsStatus = (state) => state.trip.status;
export const getTripsError = (state) => state.trip.error;
// Action creators are generated for each case reducer function
// export const { setItems } = clientSlice.actions;

export default tripsSlice.reducer;
