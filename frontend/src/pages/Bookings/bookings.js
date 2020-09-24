import React, { Component } from "react";
import Spinner from "../../components/spinner/spinner";

import AuthContext from "../../context/auth.context";

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.getBookings();
  }

  getBookings = () => {
    this.setState({
      isLoading: true,
    });
    const requestBody = {
      query: `
          query {
            bookings {
              _id
              event {
                title
                date
              }
              createdAt
              updatedAt
            }
          }
        `,
    };

    const token = this.context.token;

    fetch("http://localhost:5000/home", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        this.setState({
          bookings: resData.data.bookings,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const bookingsList = this.state.bookings.map((booking) => {
      return (
        <li key={booking._id}>
          {booking.event.title} -{" "}
          {new Date(booking.event.date).toLocaleDateString()}
        </li>
      );
    });
    return (
      <React.Fragment>
        {this.state.isLoading ? <Spinner /> : <ul>{bookingsList}</ul>}
      </React.Fragment>
    );
  }
}

export default BookingsPage;
