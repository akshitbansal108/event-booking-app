import React from 'react';
import { NavLink } from 'react-router-dom';

import './main.navigation.css';

const MainNavigation = props => (
  <header className="navigation">
    <div className="navigation__head">
      <h1>Booky</h1>
    </div>
    <nav className="navigation__items">
      <ul>
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        <li>
          <NavLink to="/bookings">Bookings</NavLink>
        </li>
      </ul>
    </nav>
  </header>
);

export default MainNavigation;