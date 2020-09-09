const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const mongoose = require('mongoose');
const Event = require('./models/event');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use('/home', graphqlHTTP({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      ticket: Float!
      date: String!
    }
    input EventInput {
      title: String!
      description: String!
      ticket: Float!
    }
    type RootQuery {
      events: [Event!]!
    }
    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event.find().then(
        events => {
          return events.map(event => {
            return { ...event._doc, _id: event.id };
          });
        }
      ).catch(err => {
        console.log(err);
      });
    },
    createEvent: (args) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        ticket: +args.eventInput.ticket,
        date: new Date()
      });
      event.save().then(
        res => {
          return { ...res._doc, _id: res._doc._id.toString() };
        }
      ).catch(err => {
        console.log(err)
      })
      return event;
    }
  },
  graphiql: true
}));

mongoose.connect(process.env.MONGO_CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(3000);
});
