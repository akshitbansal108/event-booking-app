import React, { Component } from "react";
import BookingList from "../../components/bookings/booking-list/booking-list";
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
        this.setState({
          isLoading: false,
        });
      });
  };

  onBookingCancel = (bookingId) => {
    this.setState({
      isLoading: true,
    });
    const requestBody = {
      query: `
          mutation {
            cancelBooking(bookingId: "${bookingId}") {
              _id
              title
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
        this.setState((prevState) => {
          const updatedBookings = this.state.bookings.filter((booking) => {
            return booking._id !== bookingId;
          });
          return {
            bookings: updatedBookings,
            isLoading: false,
          };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false,
        });
      });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <BookingList
            bookings={this.state.bookings}
            onBookingCancel={this.onBookingCancel}
          />
        )}
      </React.Fragment>
    );
  }
}

export default BookingsPage;
