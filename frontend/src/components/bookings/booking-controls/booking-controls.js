import React from "react";

import "./booking-controls.css";

const BookingControls = (props) => {
  return (
    <div className="booking-controls">
      <button
        className={props.selectedOutputType === "list" ? "active" : ""}
        onClick={props.onOutputTypeChange.bind(this, "list")}
      >
        List View
      </button>
      <button
        className={props.selectedOutputType === "chart" ? "active" : ""}
        onClick={props.onOutputTypeChange.bind(this, "chart")}
      >
        Chart View
      </button>
    </div>
  );
};

export default BookingControls;
