import React from "react";

import "./event-list.css";
import EventItem from "./event-item/event-item";

const EventList = (props) => {
  const events = props.events.map((event) => {
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        title={event.title}
        ticket={event.ticket}
        date={event.date}
        authUserId={props.authUserId}
        creatorId={event.creator._id}
        onViewDetail={props.onViewDetail}
      />
    );
  });
  return <ul className="event__list">{events}</ul>;
};

export default EventList;
