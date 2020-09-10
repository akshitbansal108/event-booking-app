const Event = require("../../models/event");
const Booking = require("../../models/booking");

const { transformBooking, transformEvent } = require("./helpers/transform.helper");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args) => {
    try {
      const bookedEvent = await Event.findById(args.eventId);
      const userId = "5f58fdee5d5d6448be380b93";
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
  cancelBooking: async (args) => {
    try {
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