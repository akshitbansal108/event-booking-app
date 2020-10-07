import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AuthPage from "./pages/Auth/Auth";
import BookingsPage from "./pages/Bookings/bookings";
import EventsPage from "./pages/Events/events";

import Navigation from "./components/navigation/navigation";
import AuthContext from "./context/auth.context";

class App extends Component {
  state = {
    token: null,
    userId: null,
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    this.login(token, userId, tokenExpiration);
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({
      token: token,
      userId: userId,
    });
  };

  logout = () => {
    this.setState({
      token: null,
      userId: null,
    });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiration");
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout,
            }}
          >
            <Navigation />
            <main className="main-content">
              <Switch>
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && (
                  <Redirect from="/auth" to="/events" exact />
                )}
                <Route path="/events" component={EventsPage} />
                {this.state.token && (
                  <Route path="/bookings" component={BookingsPage} />
                )}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
