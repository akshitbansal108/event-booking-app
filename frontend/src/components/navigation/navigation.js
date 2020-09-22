import React from "react";
import { NavLink } from "react-router-dom";

import "./navigation.css";
import AuthContext from "../../context/auth.context";

const MainNavigation = (props) => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className="navigation">
          <div className="navigation__head">
            <h1>BookMyEvent</h1>
          </div>
          <nav className="navigation__items">
            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/auth">Authenticate</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default MainNavigation;
