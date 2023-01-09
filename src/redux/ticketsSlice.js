import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  apiCount: 0,
  tickets: [],
  status: "idle", // 'idle' | 'loading'  | 'succeeded | 'failed'
  error: null,
};
export const fetchTickets = createAsyncThunk("getTickets", async (data) => {
  const { startDate, endDate, client_id } = data;
  
  // console.log(user_id);
  const axiosInstanceRemote = axios.create();
  const response = await axiosInstanceRemote.get(
    `https://cloud.zig-web.com/api/ZIGShuttle/GetAllTicketHistory?startDate=${startDate}&endDate=${endDate}&client_id=${client_id}`
  );

  // const response = await axiosInstanceRemote.get(
  //   `https://cloud.zig-web.com/api/ZIGShuttle/GetAllTicketHistory?startDate=${startDate}&endDate=${endDate}&client_id=${client_id}`
  //   // `https://zig-web.com/ZIGSmartWeb/api/ZIGShuttle/Getuserpurchasehistory?startDate=${startDate}&endDate=${endDate}`
  // );
  // const response = await axios.get(
  //   `ZIGShuttle/GetAllTicketHistory?startDate=${startDate}&endDate=${endDate}&client_id=${sd}`
  // );
  // console.log(response.data);
  return [...response.data];
});
export const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTickets.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.apiCount = state.apiCount + 1;
        state.tickets = [...action.payload];
        state.error = null;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const selectAPICount = (state) => state.ticket.apiCount;
export const selectAllTickets = (state) => state.ticket.tickets;
export const getTicketsStatus = (state) => state.ticket.status;
export const getTicketsError = (state) => state.ticket.error;
// Action creators are generated for each case reducer function
// export const { setItems } = clientSlice.actions;

export default ticketSlice.reducer;
