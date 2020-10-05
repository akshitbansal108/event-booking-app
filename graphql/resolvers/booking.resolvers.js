const Event = require("../../models/event");
const Booking = require("../../models/booking");

const {
  transformBooking,
  transformEvent,
} = require("./helpers/transform.helper");

module.exports = {
  bookings: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("User not authenticated");
      }
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("User not authenticated");
      }
      const bookedEvent = await Event.findById(args.eventId);
      const userId = req.userId;
      const booking = new Booking({
        event: bookedEvent.id,
        user: userId,
      });
      const newBooking = await booking.save();
      return transformBooking(newBooking);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("User not authenticated");
      }
      const bookingData = await Booking.findById(args.bookingId);
      if (bookingData) {
        const eventData = await Event.findById(bookingData.event);
        await bookingData.deleteOne();
        return transformEvent(eventData);
      }
    } catch (err) {
      throw err;
    }
  },
};
