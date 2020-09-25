const User = require("../../../models/user");
const Event = require("../../../models/event");
const { dateToString } = require("./date.helper");
const DataLoader = require("dataloader");

const eventDataLoader = new DataLoader((eventIds) => {
  return eventDetails(eventIds);
});

const userDataLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const transformEvent = (event) => {
  try {
    return {
      ...event._doc,
      _id: event.id,
      date: dateToString(event._doc.date),
      creator: userDetails.bind(this, event._doc.creator),
    };
  } catch (err) {
    throw err;
  }
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
    user: userDetails.bind(this, booking._doc.user),
    event: singleEventDetails.bind(this, booking._doc.event),
  };
};

const userDetails = async (userId) => {
  try {
    const userData = await userDataLoader.load(userId.toString());
    return {
      ...userData._doc,
      _id: userData.id,
      password: null,
      createdEvents: eventDataLoader.loadMany.bind(this, userData._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

const eventDetails = async (eventIds) => {
  try {
    const eventData = await Event.find({ _id: { $in: eventIds } });
    return eventData.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEventDetails = async (eventId) => {
  try {
    const eventData = await eventDataLoader.load(eventId.toString());
    return eventData;
  } catch (err) {
    throw err;
  }
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.eventDetails = eventDetails;
