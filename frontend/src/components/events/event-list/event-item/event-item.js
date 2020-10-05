import React from "react";

import "./event-item.css";

const EventItem = (props) => {
  const presentDate = new Date();
  const eventDate = new Date(props.date);
  return (
    <li className="event__list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>
          ${props.ticket} - {eventDate.toLocaleDateString()}
        </h2>
      </div>
      <div>
        {eventDate.getTime() < presentDate.getTime() ? (
          <p>
            <i>Outdated</i>
          </p>
        ) : props.authUserId === props.creatorId ? (
          <p>
            <i>Owner</i>
          </p>
        ) : (
          <button
            className="btn"
            onClick={props.onViewDetail.bind(this, props.eventId)}
          >
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
