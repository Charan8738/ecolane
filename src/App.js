import React, { lazy } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { RedirectAs404 } from "./utils/Utils";
import PrivateRoute from "./route/PrivateRoute";

import Layout from "./layout/Index";

import Login from "./pages/auth/Login";
const Register = lazy(() => import("./pages/auth/Register"));

const App = (props) => {
  return (
    <Switch>
      {/* Auth Pages */}
      <Route exact path={`${process.env.PUBLIC_URL}/auth-register`} component={Register}></Route>
      <Route exact path={`${process.env.PUBLIC_URL}/auth-login`} component={Login}></Route>
      {/*Main Routes*/}
      <PrivateRoute exact path="" component={Layout}></PrivateRoute>

      <Route component={RedirectAs404}></Route>
    </Switch>
  );
};
export default withRouter(App);
