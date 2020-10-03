import React, { Component } from "react";

import "./events.css";

import Backdrop from "../../components/backdrop/backdrop";
import Modal from "../../components/modal/modal";
import AuthContext from "../../context/auth.context";
import EventList from "../../components/events/event-list/event-list";
import Spinner from "../../components/spinner/spinner";

class EventsPage extends Component {
  state = {
    creatingEvent: false,
    events: [],
    selectedEvent: null,
    isLoading: false,
  };

  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElement = React.createRef();
    this.ticketElement = React.createRef();
    this.dateElement = React.createRef();
    this.descriptionElement = React.createRef();
  }

  componentDidMount() {
    this.getEvents();
  }

  callCreateEventModal = () => {
    this.setState({
      creatingEvent: true,
    });
  };

  cancelHandler = () => {
    this.setState({
      creatingEvent: false,
      selectedEvent: null,
    });
  };

  getEvents = () => {
    this.setState({
      isLoading: true,
    });
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              date
              ticket
              description
              creator {
                _id
              }
            }
          }
        `,
    };

    fetch("http://localhost:5000/home", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        if (this.isActive) {
          this.setState({
            events: resData.data.events,
            isLoading: false,
          });
        }
      })
      .catch((err) => {
        if (this.isActive) {
          this.setState({
            isLoading: false,
          });
        }
      });
  };

  confirmHandler = () => {
    this.setState({
      creatingEvent: false,
    });

    const title = this.titleElement.current.value;
    const ticket = +this.ticketElement.current.value;
    const date = this.dateElement.current.value;
    const description = this.descriptionElement.current.value;

    if (
      title.trim().length === 0 ||
      ticket < 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, ticket, date, description };
    console.log(event);

    const requestBody = {
      query: `
          mutation CreateEvent($title: String!, $ticket: Float!, $date: String!, $description: String!) {
            createEvent(eventInput: {title: $title, ticket: $ticket, date: $date, description: $description}) {
              _id
              title
              date
              ticket
              description
            }
          }
        `,
      variables: {
        title: title,
        ticket: ticket,
        date: date,
        description: description,
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
          const updatedEvents = [...prevState.events];
          updatedEvents.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            date: resData.data.createEvent.date,
            ticket: resData.data.createEvent.ticket,
            description: resData.data.createEvent.description,
            creator: {
              _id: this.context.userId,
            },
          });
          return {
            events: updatedEvents,
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  bookEventHandler = () => {
    const requestBody = {
      query: `
          mutation BookEvent($eventId: ID!) {
            bookEvent(eventId: $eventId) {
              _id
              createdAt
              updatedAt
            }
          }
        `,
      variables: {
        eventId: this.state.selectedEvent._id,
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
        this.setState({
          selectedEvent: null,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          selectedEvent: null,
        });
      });
  };

  onViewDetail = (eventId) => {
    this.setState((prevState) => {
      const event = prevState.events.find((event) => event._id === eventId);
      return {
        selectedEvent: event,
      };
    });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <React.Fragment>
        {(this.state.creatingEvent || this.state.selectedEvent) && <Backdrop />}
        {this.state.creatingEvent && (
          <Modal
            title="Create New Event"
            canCancel
            canConfirm
            confirmText="Confirm"
            cancelText="Cancel"
            onCancel={this.cancelHandler}
            onConfirm={this.confirmHandler}
          >
            <form>
              <div className="form-input">
                <label htmlFor="title">Title</label>
                <input type="title" id="title" ref={this.titleElement} />
              </div>
              <div className="form-input">
                <label htmlFor="ticket">Ticket Price (in USD)</label>
                <input type="ticket" id="ticket" ref={this.ticketElement} />
              </div>
              <div className="form-input">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElement} />
              </div>
              <div className="form-input">
                <label htmlFor="description">Description</label>
                <textarea
                  type="description"
                  id="description"
                  ref={this.descriptionElement}
                />
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedEvent && (
          <Modal
            title="Event Details"
            canCancel
            canConfirm={this.context.token ? true : false}
            confirmText="Book"
            cancelText="Back"
            onCancel={this.cancelHandler}
            onConfirm={this.bookEventHandler}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              ${this.state.selectedEvent.ticket} -{" "}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.callCreateEventModal}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.onViewDetail}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventsPage;
