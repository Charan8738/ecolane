import React, { Suspense, useLayoutEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { RedirectAs404 } from "../utils/Utils";
import { useSelector } from "react-redux";
import { selectHomepage } from "../redux/userSlice";
import AddTracker from "../pages/AddTracker";
import TrackerInfo from "../pages/TrackerInfo";
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
const visitorsvip = React.lazy(() => import("../pages/visitorsvip"));
const users = React.lazy(() => import("../pages/users"));
const Analytics = React.lazy(() => import("../pages/Analytics"));
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
    { page: 13, pathname: "alerts", component: Alerts },
    { page: 14, pathname: "asset-management", component: AssetManagement },
    { page: 15, pathname: "documentation", component: Documentation },
    { page: 16, pathname: "add-tracker", component: AddTracker },
    { page: 17, pathname: "rideinfotwo", component: rideinfotwo },
    { page: 17, pathname: "Payment", component: Payment },
    { page: 17, pathname: "Transactions", component: Transactions },
    { page: 17, pathname: "Transactions2", component: Transactions2 },
    { page: 17, pathname: "support", component: support },
    { page: 17, pathname: "visitorhistory", component: visitorhistory },
    { page: 17, pathname: "counterlist", component: counterlist },
    { page: 17, pathname: "visitors", component: visitors },
    { page: 17, pathname: "visitorsvip", component: visitorsvip },
    { page: 17, pathname: "users", component: users },
    { page: 18, pathname: "analytics", component: Analytics },
  ];
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <Suspense fallback={<div />}>
      <Switch>
        <Route path={`/tracker-info`} component={TrackerInfo} />
        <Route path={`${process.env.PUBLIC_URL}/device/:id`} component={DeviceConfig}></Route>
        {rolesRoutePages.map(
          (route) =>
            [...currentAccess, 14, 15, 16, 18].includes(route.page) && (
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
