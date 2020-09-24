import React from "react";

import "./booking-list.css";

const BookingList = (props) => {
  const bookingsList = props.bookings.map((booking) => {
    return (
      <li key={booking._id} className="bookings__item">
        <div>
          <b>{booking.event.title}</b> on{" "}
          {new Date(booking.event.date).toLocaleDateString()} at{" "}
          {new Date(booking.event.date).toLocaleTimeString()}
          <br></br>
          <br></br>
          Booked on - {new Date(booking.createdAt).toLocaleDateString()} at{" "}
          {new Date(booking.createdAt).toLocaleTimeString()}
        </div>
        <div>
          <button
            className="btn"
            onClick={props.onBookingCancel.bind(this, booking._id)}
          >
            Cancel
          </button>
        </div>
      </li>
    );
  });

  return (
    <React.Fragment>
      <ul className="bookings__list">{bookingsList}</ul>
    </React.Fragment>
  );
};

export default BookingList;
