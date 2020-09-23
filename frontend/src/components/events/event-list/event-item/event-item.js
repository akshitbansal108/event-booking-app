import React from "react";

import "./event-item.css";

const EventItem = (props) => {
  return (
    <li className="event__list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>
          ${props.ticket} - {new Date(props.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {props.authUserId === props.creatorId ? (
          <p>
            <i>Owner</i>
          </p>
        ) : (
          <button className="btn" onClick={props.onViewDetail.bind(this, props.eventId)}>View Details</button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
