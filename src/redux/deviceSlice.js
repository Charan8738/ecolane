import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  devices: [],
  status: "idle", // 'idle' | 'loading'  | 'succeeded | 'failed'
  error: null,
  addStatus: "idle",
};
export const addNewDevice = createAsyncThunk("devices/addNewDevice", async (device) => {
  const response = await axios.post("iot/addDeviceData", device);
  if (!response.status === 201) throw new Error();
  return response.data;
});
export const fetchDevices = createAsyncThunk("devices/getDevices", async (userId) => {
  const response = await axios.get("iot/getClientDevices?client_id=" + userId);
  if (response.status === 200) {
    if (response.data.message) {
      return [];
    } else return [...response.data];
  } else throw new Error();
});
export const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setStatusToIdle: (state) => {
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDevices.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.devices = [...action.payload];
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(addNewDevice.pending, (state, action) => {
        state.addStatus = "loading";
      })
      .addCase(addNewDevice.fulfilled, (state, action) => {
        state.devices.push(action.payload);
      })
      .addCase(addNewDevice.rejected, (state) => {
        state.addStatus = "failed";
      });
  },
});
export const selectAddDeviceStatus = (state) => state.device.addStatus;
export const selectAllDevices = (state) => state.device.devices;
export const getDevicesStatus = (state) => state.device.status;
export const getDevicesError = (state) => state.device.error;
// Action creators are generated for each case reducer function
export const { setStatusToIdle } = deviceSlice.actions;

export default deviceSlice.reducer;
