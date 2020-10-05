const Event = require("../../models/event");
const User = require("../../models/user");

const { transformEvent } = require("./helpers/transform.helper");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("User not authenticated");
      }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        ticket: +args.eventInput.ticket,
        date: new Date(args.eventInput.date),
        creator: req.userId,
      });
      const creator = await User.findById(event.creator);
      if (!creator) {
        throw new Error("User Not Found");
      }
      creator.createdEvents.push(event);
      creator.save();
      const newEvent = await event.save();
      return transformEvent(newEvent);
    } catch (err) {
      throw err;
    }
  },
};
