import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";
import { user_id } from "../redux/userSlice";

const initialState = {
  devices: [],
  status: "idle", // 'idle' | 'loading'  | 'succeeded | 'failed'
  error: null,
};

export const fetchDevicess = createAsyncThunk("getClientDevices", async () => {
  try {
    const response = await axios.get("iot/getClientDevices?client_id=1");
    return [...response.data];
  } catch (err) {
    return err.message;
  }
});
export const addDeviceSlice = createSlice({
  name: "addDevice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDevicess.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchDevicess.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.devices = [...action.payload];
      })
      .addCase(fetchDevicess.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllDevices = (state) => state.addDevice.devices;
export const getDevicesStatus = (state) => state.addDevice.status;
export const getDevicesError = (state) => state.addDevice.error;

export const { setItems } = addDeviceSlice.actions;

export default addDeviceSlice.reducer;
