import { configureStore } from "@reduxjs/toolkit";
import deviceReducer from "./deviceSlice";
import clientReducer from "./clientSlice";
import beverageReducer from "./beverageSlice";
import ticketReducer from "./ticketsSlice";
import UserReducer from "./userSlice";
import addDeviceReducer from "./addDeviceSlice";
import gpsDataReducer from "./gpsSlice";
import tripsReducer from "./tripsSlice";
export const store = configureStore({
  reducer: {
    device: deviceReducer,
    client: clientReducer,
    beverage: beverageReducer,
    ticket: ticketReducer,
    user: UserReducer,
    addDevice: addDeviceReducer,
    gps: gpsDataReducer,
    trip: tripsReducer,
  },
});
