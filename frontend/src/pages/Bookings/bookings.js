import React, { Component } from "react";
import BookingChart from "../../components/bookings/booking-chart/booking-chart";
import BookingControls from "../../components/bookings/booking-controls/booking-controls";
import BookingList from "../../components/bookings/booking-list/booking-list";
import Spinner from "../../components/spinner/spinner";

import AuthContext from "../../context/auth.context";

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: "list",
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
                ticket
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
          mutation CancelBooking($bookingId: ID!) {
            cancelBooking(bookingId: $bookingId) {
              _id
              title
            }
          }
        `,
      variables: {
        bookingId: bookingId,
      },
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

  outputTypeChangeHandler = (outputType) => {
    if (["list", "chart"].includes(outputType)) {
      this.setState({
        outputType: outputType,
      });
    }
  };

  render() {
    let bookingsData = <Spinner />;
    if (!this.state.isLoading) {
      bookingsData = (
        <React.Fragment>
          <BookingControls
            onOutputTypeChange={this.outputTypeChangeHandler}
            selectedOutputType={this.state.outputType}
          />
          {this.state.outputType === "list" ? (
            <BookingList
              bookings={this.state.bookings}
              onBookingCancel={this.onBookingCancel}
            />
          ) : (
            <BookingChart bookings={this.state.bookings} />
          )}
        </React.Fragment>
      );
    }
    return <React.Fragment>{bookingsData}</React.Fragment>;
  }
}

export default BookingsPage;
