import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  Latitude: "11.656501",
  Longitude: "80.8931273",
  Speed: 0,
  Altitude: null,
  Voltage: null,
  Direction: null,
  Gpssignal: null,
  Wifisignal: null,
  satelliteCount: null,
  WifiMacAddress: null,
  added_date: null,
  status: "idle",
};

export const fetchLastGpsData = createAsyncThunk("getLastGpsData", async (devicemac) => {
  const response = await axios.get("Firmware/getlastgpsdata?WifiMacAddress=" + devicemac);
  if (response.data.Latitude != null) {
    return { ...response.data };
  } else {
    throw new Error();
  }
});

export const gpsSlice = createSlice({
  name: "gps",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchLastGpsData.fulfilled, (state, action) => {
      state.Latitude = action.payload.Latitude;
      state.Longitude = action.payload.Longitude;
      state.Speed = action.payload.Speed;
      state.Altitude = action.payload.Altitude;
      state.Voltage = action.payload.Voltage;
      state.Direction = action.payload.Direction;
      state.Gpssignal = action.payload.Gpssignal;
      state.Wifisignal = action.payload.Wifisignal;
      state.satelliteCount = action.payload.satelliteCount;
      state.WifiMacAddress = action.payload.WifiMacAddress;
      state.added_date = action.payload.added_date;
      state.status = "succeeded";
    });
    builder.addCase(fetchLastGpsData.pending, (state, action) => {
      state.status = "failed";
    });
  },
});
export const Latitude = (state) => state.gps.Latitude;
export const Longitude = (state) => state.gps.Longitude;
export const Altitude = (state) => state.gps.Altitude;
export const Voltage = (state) => state.gps.Voltage;
export const Direction = (state) => state.gps.Direction;
export const Gpssignal = (state) => state.gps.Gpssignal;
export const selectSpeed = (state) => state.gps.Speed;
export const Wifisignal = (state) => state.gps.Wifisignal;
export const satelliteCount = (state) => state.gps.satelliteCount;
export const WifiMacAddress = (state) => state.gps.WifiMacAddress;
export const added_date = (state) => state.gps.added_date;

export default gpsSlice.reducer;
