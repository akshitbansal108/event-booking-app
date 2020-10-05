const userResolver = require("./auth.resolvers");
const eventResolver = require("./event.resolvers");
const bookingResolver = require("./booking.resolvers");

module.exports = {
  ...userResolver,
  ...eventResolver,
  ...bookingResolver,
};
