const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const events = [];

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
      return events;
    },
    createEvent: (args) => {
      const event = {
        _id: Math.random().toString(),
        title: args.eventInput.title,
        description: args.eventInput.description,
        ticket: +args.eventInput.ticket,
        date: new Date().toISOString()
      };
      events.push(event);
      return event;
    }
  },
  graphiql: true
}));

app.listen(3000);