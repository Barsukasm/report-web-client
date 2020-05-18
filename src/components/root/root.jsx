import React from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./root.css";

import { getCurrentUser } from "../../utils/user-authorization";
import LoginPage from "../login-page";
import Reports from "../reports";

const AuthorizedRoute = ({ ...props }) => getCurrentUser() ? <Route { ...props } /> : <Redirect to="/login" />;

class Root extends React.Component {
  render() {
    return(
      <Router>
        <Switch>
          <Route path="/login" component={ LoginPage }/>
          <AuthorizedRoute exact path="/" component={ Reports } />
        </Switch>
      </Router>
    );
  }
}

export default Root;