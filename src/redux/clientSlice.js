import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  clients: [],
  status: "idle", // 'idle' | 'loading'  | 'succeeded | 'failed'
  error: null,
};

export const fetchClients = createAsyncThunk("clients/getClients", async () => {
  const response = await axios.get("iot/getAllClients");
  if (response.status === 200) return [...response.data];
  else throw new Error("Error in fetching client");
});
export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchClients.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.clients = [...action.payload];
        state.error = null;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const selectAllClients = (state) => state.client.clients;
export const getClientsStatus = (state) => state.client.status;
export const getClientsError = (state) => state.client.error;
// Action creators are generated for each case reducer function

export default clientSlice.reducer;
