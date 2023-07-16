import React, { Suspense, useLayoutEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { RedirectAs404 } from "../utils/Utils";
import { useSelector } from "react-redux";
import { selectHomepage } from "../redux/userSlice";
import AddTracker from "../pages/AddTracker";
import FleetTracker from "../pages/FleetTracker";
import TrackerInfo from "../pages/TrackerInfo";
import VehicleInfo from "../pages/VehicleInfo";
import ScheduleInfo from "../pages/ScheduleInfo";
import AlertManage from "../pages/AlertManage";
import home from "../pages/home";
import EvolutionConfig from "../pages/EvolutionConfig";
import AllVenues from "../pages/AllVenues";
import Attendance from "../pages/Attendance";
import tickets from "../pages/tickets";
import UserSettings from "../pages/UserSettings";
import RunCut from "../pages/RunCut";
import RunCutting from "../pages/RunCutting";
import DriverSchedule from "../pages/DriverSchedule";
import drivers from "../pages/drivers";
import CreateSchedule from "../pages/CreateSchedule";
import EditSchedule from "../pages/EditSchedule";
// const FleetTracker = React.lazy(() => import("../pages/FleetTracker"));
const AssetManagement = React.lazy(() => import("../pages/AssetManagement"));
const Homepage = React.lazy(() => import("../pages/Devices"));
const AddNewDevice = React.lazy(() => import("../pages/AddNewDevice"));
const DeviceConfig = React.lazy(() => import("../pages/DeviceConfig"));
const GTFS = React.lazy(() => import("../pages/GTFS"));
const ClientSetup = React.lazy(() => import("../pages/ClientSetup"));
const Beveragecounter1 = React.lazy(() => import("../pages/Beveragecounter1"));
const Ticketspage = React.lazy(() => import("../pages/Ticketspage"));
const AddValidator = React.lazy(() => import("../pages/AddValidator"));
const addBeverages = React.lazy(() => import("../pages/addBeverages"));
const TransitData = React.lazy(() => import("../pages/TransitData"));
const ClientsNew = React.lazy(() => import("../pages/ClientsNew"));
const TransitApproval = React.lazy(() => import("../pages/TransitApproval"));
const MuseumData = React.lazy(() => import("../pages/MuseumData"));
const Alerts = React.lazy(() => import("../pages/Alerts"));
const Documentation = React.lazy(() => import("../pages/Documentation"));
const rideinfotwo = React.lazy(() => import("../pages/rideinfotwo"));
const Payment = React.lazy(() => import("../pages/Payment"));
const Transactions = React.lazy(() => import("../pages/Transactions"));
const Transactions2 = React.lazy(() => import("../pages/Transactionstwo"));
const support = React.lazy(() => import("../pages/support"));
const visitorhistory = React.lazy(() => import("../pages/visitorhistory"));
const counterlist = React.lazy(() => import("../pages/counterlist"));
const visitors = React.lazy(() => import("../pages/visitors"));
const visitorsvip = React.lazy(() => import("../pages/Visitors_Vip"));
const users = React.lazy(() => import("../pages/users"));
const Analytics = React.lazy(() => import("../pages/Analytics"));
const LimaAnalytics = React.lazy(() => import("../pages/LimaAnalytics"));
const VehicleSetup = React.lazy(() => import("../pages/VehicleSetup"));
const DeviceSetup = React.lazy(() => import("../pages/DeviceSetup"));
// const EvolutionConfig = React.lazy(() => import("../pages/EvolutionConfig"));
const Pages = ({ currentAccess }) => {
  const homepage = useSelector(selectHomepage) || currentAccess[0];
  const rolesRoutePages = [
    { page: 1, pathname: "devices", component: Homepage },
    { page: 2, pathname: "add-device", component: AddNewDevice },
    { page: 3, pathname: "gtfs", component: GTFS },
    { page: 4, pathname: "clients", component: ClientsNew },
    { page: 5, pathname: "client-setup", component: ClientSetup },
    { page: 6, pathname: "Beverage-c1", component: Beveragecounter1 },
    { page: 7, pathname: "Tickets", component: Ticketspage },
    { page: 8, pathname: "add-validator", component: AddValidator },
    { page: 9, pathname: "add-beverages", component: addBeverages },
    { page: 10, pathname: "transit-data", component: TransitData },
    { page: 11, pathname: "transit-approval", component: TransitApproval },
    { page: 12, pathname: "museum-data", component: MuseumData },
    { page: 13, pathname: "run-cutting", component: Alerts },
    { page: 14, pathname: "asset-management", component: AssetManagement },
    { page: 15, pathname: "documentation", component: Documentation },
    { page: 16, pathname: "add-tracker", component: AddTracker },
    { page: 29, pathname: "fleet-tracker", component: FleetTracker },
    { page: 17, pathname: "Payment", component: Payment },
    // { page: 18, pathname: "beverage-history", component: Transactions },
    { page: 19, pathname: "transactions", component: Transactions2 },
    { page: 20, pathname: "support", component: support },
    { page: 21, pathname: "visitorhistory", component: visitorhistory },
    { page: 22, pathname: "counterlist", component: counterlist },
    { page: 23, pathname: "visitors", component: visitors },
    { page: 24, pathname: "visitorsvip", component: visitorsvip },
    { page: 25, pathname: "users", component: users },
    { page: 26, pathname: "analytics", component: Analytics },
    { page: 27, pathname: "vehicle-setup", component: VehicleSetup },
    { page: 28, pathname: "device-setup", component: DeviceSetup },
    // { page: 30, pathname: "bus-schedules", component: AlertManage },
    { page: 31, pathname: "home", component: home },
    { page: 32, pathname: "evo-config", component: EvolutionConfig },
    { page: 33, pathname: "all-venues", component: AllVenues },
    { page: 34, pathname: "attendance", component: Attendance },
    { page: 35, pathname: "tickets-booth", component: tickets },
    { page: 36, pathname: "lima-analytics", component: LimaAnalytics },
    // { page: 30, pathname: "run", component: RunCut },
    // { page: 30, pathname: "run-cutting-scheduler", component: RunCutting },
    // { page: 30, pathname: "driver-schedule", component: DriverSchedule },
    // { page: 30, pathname: "drivers", component: drivers },
  ];
  RunCutting;
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <Suspense fallback={<div />}>
      <Switch>
        <Route path={`/create-schedule`} component={CreateSchedule} />
        <Route path={`/edit-schedule`} component={EditSchedule} />
        <Route path={`/run`} component={RunCut} />
        <Route path={`/run-cutting-scheduler`} component={RunCutting} />
        <Route path={`/driver-schedule`} component={DriverSchedule} />
        <Route path={`/drivers`} component={drivers} />
        <Route path={`/tracker-info`} component={TrackerInfo} />
        <Route path={`/vehicle-info`} component={VehicleInfo} />
        <Route path={`/schedule-info`} component={ScheduleInfo} />
        <Route path={`/user-profile-setting`} component={UserSettings} />
        <Route path={`${process.env.PUBLIC_URL}/device/:id`} component={DeviceConfig}></Route>
        {rolesRoutePages.map(
          (route) =>
            /* Page 27 made static below and at Menu.js line 282. Make sure to remove at both places*/
            [...currentAccess, 30].includes(route.page) && (
              <Route
                key={route.page}
                page={route.page}
                exact
                path={`${process.env.PUBLIC_URL}/${homepage === route.page ? "" : route.pathname}`}
                component={route.component}
              ></Route>
            )
        )}
        <Route component={RedirectAs404}></Route>
      </Switch>
    </Suspense>
  );
};
export default Pages;
