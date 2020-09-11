import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import AuthComponent from './components/auth.component';
import BookingsComponent from './components/booking.component';
import EventsComponent from './components/event.component';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from="/" to="/auth" exact />
        <Route path="/auth" component={AuthComponent} />
        <Route path="/events" component={EventsComponent} />
        <Route path="/bookings" component={BookingsComponent} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
