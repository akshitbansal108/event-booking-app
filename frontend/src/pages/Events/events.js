import React, { Component } from "react";

import "./events.css";

import Backdrop from "../../components/backdrop/backdrop";
import Modal from "../../components/modal/modal";
import AuthContext from "../../context/auth.context";

class EventsPage extends Component {
  state = {
    creatingEvent: false,
    events: [],
  };

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
    });
  };

  getEvents = () => {
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
                email
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
        this.setState({
          events: resData.data.events,
        });
      })
      .catch((err) => {
        console.log(err);
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
          mutation {
            createEvent(eventInput: {title: "${title}", ticket: ${ticket}, date: "${date}", description: "${description}"}) {
              _id
              title
              date
              ticket
              description
              creator {
                _id
                email
              }
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
        // console.log(resData.data.createEvent);
        // this.setState((prevState) => {
        //   return { events: prevState.events.push(resData.data.createEvent) };
        // });
        this.getEvents();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const eventList = this.state.events.map((event) => {
      return (
        <li key={event._id} className="events__list_item">
          <b>{event.title}</b>: {event.description}
        </li>
      );
    });

    return (
      <React.Fragment>
        {this.state.creatingEvent && <Backdrop />}
        {this.state.creatingEvent && (
          <Modal
            title="Create New Event"
            canCancel
            canConfirm
            onCancel={this.cancelHandler}
            onConfirm={this.confirmHandler}
          >
            <form>
              <div className="form-input">
                <label htmlFor="title">Title</label>
                <input type="title" id="title" ref={this.titleElement} />
              </div>
              <div className="form-input">
                <label htmlFor="ticket">Ticket Price (in INR)</label>
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
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.callCreateEventModal}>
              Create Event
            </button>
          </div>
        )}
        <ul className="event__list">{eventList}</ul>
      </React.Fragment>
    );
  }
}

export default EventsPage;
